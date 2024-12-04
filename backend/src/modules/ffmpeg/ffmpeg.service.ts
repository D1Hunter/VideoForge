import { BadRequestException, Injectable } from "@nestjs/common";
import * as ffmpegStatic from 'ffmpeg-static';
import * as ffmpeg from 'fluent-ffmpeg';
import * as ffprobe from 'ffprobe-static';
import { join } from "path";
import { VideoFilterType } from "../video/filter-type.enum";
import { ProcessVideoDto } from "../video/dto/process-video.dto";
import { VideoOperationType } from "../video/video-operation.enum";

const ffmpegPath: string = ffmpegStatic as unknown as string;

@Injectable()
export class FFmpegService {
    constructor() {
        ffmpeg.setFfmpegPath(ffmpegPath);
        ffmpeg.setFfprobePath(ffprobe.path);
    }

    async generateThumbnail(videoPath: string, outputDir: string, timestamp = '00:00:01'): Promise<string> {
        const outputFile = join(outputDir, `thumbnail-${Date.now()}.png`);

        return new Promise((resolve, reject) => {
            ffmpeg(videoPath)
                .on('end', () => resolve(outputFile))
                .on('error', (err) => {
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
        dto: ProcessVideoDto,
        outputDir: string,
    ): Promise<string> {
        const outputFilePath = this.generateOutputFilePath(outputDir);
        const ffmpegCommand = this.prepareFFmpegCommand(videoPath, dto);
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
        dto: ProcessVideoDto,
    ): ffmpeg.FfmpegCommand {
        let ffmpegCommand = ffmpeg(videoPath);
        switch (dto.operationType) {
            case VideoOperationType.FILTER:
                if (!dto.filterType) {
                    throw new Error('Filter type is required for FILTER operation');
                }
                const filterCommand = this.getFilterCommand(dto.filterType);
                if (filterCommand) {
                    ffmpegCommand = ffmpegCommand.videoFilter(filterCommand);
                }
                break;

            case VideoOperationType.TRIM:
                if (dto.startTime) {
                    ffmpegCommand = ffmpegCommand.setStartTime(dto.startTime);
                }
                if (dto.duration) {
                    ffmpegCommand = ffmpegCommand.setDuration(dto.duration);
                }
                break;
            default:
                throw new Error(`Unsupported operation type: ${dto.operationType}`);
        }

        return ffmpegCommand;
    }
}