import { BadRequestException, Injectable } from "@nestjs/common";
import { VideoRepository } from "./video.repository";
import { CreateVideoDto } from "./dto/create-video.dto";
import { Video } from "./video.model";
import * as ffmpegStatic from 'ffmpeg-static';
import * as ffmpeg from "fluent-ffmpeg";
import * as ffprobe from 'ffprobe-static';
import { existsSync, mkdirSync } from "fs";
import { join } from "path";

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
        if (!existsSync(outputDir)) {
            mkdirSync(outputDir, { recursive: true });
        }

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