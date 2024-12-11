import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Request, Response } from 'express';
import * as fs from 'fs';
import { VideoRepository } from "./video.repository";
import { CreateVideoDto } from "./dto/create-video.dto";
import { Video } from "./video.model";
import { FFmpegService } from "../ffmpeg/ffmpeg.service";
import { FileUploadService } from "../file-upload/file-upload.service";
import { ProcessVideoDto } from "./dto/process-video.dto";
import * as crypto from 'crypto';
import * as path from 'path';
import { STATIC_FOLDER_PATH } from "../../paths/paths";

@Injectable()
export class VideoService {
    constructor(
        private readonly videoRepository: VideoRepository,
        private readonly fileUploadService: FileUploadService,
        private readonly ffMpegService: FFmpegService
    ) { }

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

    async deleteVideoById(id: string): Promise<void> {
        const video = await this.videoRepository.findOneById(id);
        if (!video) throw new NotFoundException('Video not found');

        const filePath = video.filePath;
        if (!(await this.fileUploadService.getFile(filePath))) {
            throw new NotFoundException('Video file not found');
        }
        await this.fileUploadService.deleteFile(filePath);

        const thumbnailPath = video.thumbnailPath;
        if (await this.fileUploadService.getFile(thumbnailPath)) {
            await this.fileUploadService.deleteFile(thumbnailPath);
        }

        await this.deleteVideo(video.id);
    }

    decryptAES_CBC(encryptedBuffer: Buffer, key: Uint8Array): Buffer {
        const iv = encryptedBuffer.slice(0, 16);
        const encryptedData = encryptedBuffer.slice(16);

        const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
        return decrypted;
    }

    encryptAES_CBC(data: Buffer, key: Uint8Array): Buffer {
        const iv = crypto.randomBytes(16);

        const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);

        const encryptedData = Buffer.concat([cipher.update(data), cipher.final()]);

        return Buffer.concat([iv, encryptedData]);
    }

    async handleVideoUpload(
        file: Express.Multer.File,
        userId: string,
        projectId: string,
        staticFolderPath: string
    ): Promise<{ message: string }> {
        const key = new TextEncoder().encode(process.env.SECRET_KEY);

        const decryptedData = this.decryptAES_CBC(file.buffer, key);

        const filesPath = await this.fileUploadService.uploadBuffer(decryptedData, file.originalname, `${staticFolderPath}/${userId}`);

        const outputDir = `${staticFolderPath}/${userId}/thumbnails`;
        await this.fileUploadService.ensureOutputDir(outputDir);

        const thumbnailPath = await this.ffMpegService.generateThumbnail(filesPath, outputDir);
        const duration = await this.ffMpegService.getVideoDuration(filesPath);

        const fileNameWithoutExtension = file.originalname.replace(/\.[^/.]+$/, '');

        await this.createVideo({
            title: fileNameWithoutExtension,
            duration: duration,
            filePath: filesPath,
            thumbnailPath: path.relative(STATIC_FOLDER_PATH, thumbnailPath),
            fileSize: Math.round(file.size / 1024),
            mimetype: file.mimetype,
            projectId: projectId,
        });

        return { message: 'Video uploaded and thumbnail generated successfully' };
    }

    async handleVideoProcessing(
        videoId: string,
        userId: string,
        dto: ProcessVideoDto,
        staticFolderPath: string,
        req: Request,
        res: Response
    ): Promise<void> {
        const video = await this.findVideoById(videoId);
        if (!video) {
            throw new NotFoundException('Video not found');
        }
        const file = await this.fileUploadService.getFile(video.filePath);
        if (!file) {
            throw new NotFoundException('Video file not found');
        }

        const outputDir = `${staticFolderPath}/${userId}/temp`;
        await this.fileUploadService.ensureOutputDir(outputDir);

        const videoPath = await this.ffMpegService.processVideo(video.filePath, dto, outputDir);

        const videoRange = req.headers.range;
        console.log(req.headers.range)

        if (!videoRange) {
            res.status(416).send('Requires Range header');
            return;
        }

        const { stream, headers } = this.prepareVideoStream(videoPath, videoRange);
        const iv = crypto.randomBytes(16);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Expose-Headers', 'X-Encryption-IV');
        res.setHeader('X-Encryption-IV', iv.toString('base64'));
        res.writeHead(206, headers);

        const key = new TextEncoder().encode(process.env.SECRET_KEY).slice(0, 16);
        const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
        stream.pipe(cipher).pipe(res);
    }

    async handleGetVideoById(
        id: string,
        req: Request,
        res: Response
    ) {
        const video = await this.findVideoById(id);
        if (!video) {
            throw new NotFoundException('Video not found');
        }

        const videoPath = video.filePath;
        const fileExists = await this.fileUploadService.getFile(videoPath);
        if (!fileExists) {
            throw new NotFoundException('Video file not found');
        }

        const videoRange = req.headers.range;

        if (!videoRange) {
            res.status(416).send('Requires Range header');
            return;
        }

        const { stream, headers } = this.prepareVideoStream(videoPath, videoRange);
        const iv = crypto.randomBytes(16);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Expose-Headers', 'X-Encryption-IV');
        res.setHeader('X-Encryption-IV', iv.toString('base64'));
        res.writeHead(206, headers);

        const key = new TextEncoder().encode(process.env.SECRET_KEY).slice(0, 16);
        const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
        stream.pipe(cipher).pipe(res);
    }

    private prepareVideoStream(videoPath: string, videoRange: string) {
        const stat = fs.statSync(videoPath);
        const fileSize = stat.size;

        const [startStr, endStr] = videoRange.replace(/bytes=/, '').split('-');
        const start = parseInt(startStr, 10);
        const end = endStr ? parseInt(endStr, 10) : fileSize - 1;
        const chunkSize = end - start + 1;

        const headers = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'video/mp4',
        };

        const stream = fs.createReadStream(videoPath, { start, end });

        return { stream, headers };
    }
}