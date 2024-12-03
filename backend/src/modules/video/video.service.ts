import { BadRequestException, Injectable } from "@nestjs/common";
import { VideoRepository } from "./video.repository";
import { CreateVideoDto } from "./dto/create-video.dto";
import { Video } from "./video.model";
import * as ffmpegStatic from 'ffmpeg-static';
import * as ffmpeg from "fluent-ffmpeg";
import * as ffprobe from 'ffprobe-static';
import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import { VideoFilterType } from "./filter-type.enum";
import { spawn } from "child_process";

const ffmpegPath: string = ffmpegStatic as unknown as string;

@Injectable()
export class VideoService {
    constructor(
        private readonly videoRepository: VideoRepository,
    ) {
        ffmpeg.setFfmpegPath(ffmpegPath);
        ffmpeg.setFfprobePath(ffprobe.path);
    }

    async generateThumbnail(videoPath: string, outputDir: string, timestamp = '00:00:01'): Promise<string> {

        const outputFile = join(outputDir, `thumbnail-${Date.now()}.png`);

        return new Promise((resolve, reject) => {
            ffmpeg(videoPath)
                .on('end', () => resolve(outputFile))
                .on('error', (err) => {
                    console.error('Error generating thumbnail:', err);
                    reject(new BadRequestException('Failed to generate thumbnail'));
                })
                .screenshots({
                    timestamps: [timestamp],
                    filename: `thumbnail-${Date.now()}.png`,
                    folder: outputDir,
                });
        });
    }

    async getVideoDuration(filePath: string): Promise<number> {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(filePath, (err, metadata) => {
                if (err) return reject(err);
                const duration = metadata.format.duration || 0;
                resolve(Math.round(duration));
            });
        });
    }

    private getFilterCommand(filter: VideoFilterType): string | null {
        switch (filter) {
            case VideoFilterType.GRAYSCALE:
                return 'format=gray';
            case VideoFilterType.INVERT:
                return 'lutrgb=r=negval:g=negval:b=negval';
            case VideoFilterType.BLUR:
                return 'boxblur=2:2';
            default:
                throw new Error(`Unsupported filter type: ${filter}`);
        }
    }

    async processVideo(
        videoPath: string,
        filter: VideoFilterType,
        outputDir: string,
        options?: { startTime?: string; duration?: string },
    ): Promise<string> {
        const outputFilePath = this.generateOutputFilePath(outputDir);

        const ffmpegCommand = this.prepareFFmpegCommand(videoPath, filter, options);

        return this.executeFFmpegCommand(ffmpegCommand, outputFilePath);
    }

    private generateOutputFilePath(outputDir: string): string {
        return join(outputDir, `processed-${Date.now()}.mp4`);
    }

    private executeFFmpegCommand(
        ffmpegCommand: ffmpeg.FfmpegCommand,
        outputFilePath: string,
    ): Promise<string> {
        return new Promise((resolve, reject) => {
            ffmpegCommand
                .output(outputFilePath)
                .on('end', () => resolve(outputFilePath))
                .on('error', (err) => reject(err))
                .run();
        });
    }

    private prepareFFmpegCommand(
        videoPath: string,
        filter: VideoFilterType,
        options?: { startTime?: string; duration?: string },
    ): ffmpeg.FfmpegCommand {
        let ffmpegCommand = ffmpeg(videoPath);

        const filterCommand = this.getFilterCommand(filter);
        if (filterCommand) {
            ffmpegCommand = ffmpegCommand.videoFilter(filterCommand);
        }

        if (options?.startTime) {
            ffmpegCommand = ffmpegCommand.setStartTime(options.startTime);
        }
        if (options?.duration) {
            ffmpegCommand = ffmpegCommand.setDuration(options.duration);
        }

        return ffmpegCommand;
    }

    async createVideo(dto: CreateVideoDto): Promise<Video> {
        return this.videoRepository.create({ ...dto });
    }

    async findVideosByProject(projectId: string): Promise<Video[]> {
        return this.videoRepository.findMany({ where: { projectId } });
    }

    async findVideoById(id: string): Promise<Video> {
        return this.videoRepository.findOneById(id);
    }

    async deleteVideo(id: string): Promise<number> {
        return this.videoRepository.delete(id);
    }
}