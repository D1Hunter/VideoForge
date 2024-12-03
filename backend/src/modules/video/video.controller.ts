import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors, Res, NotFoundException, StreamableFile, Req } from "@nestjs/common";
import { Request, Response } from 'express';
import { VideoService } from "./video.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileUploadService } from "../file-upload/file-upload.service";
import { STATIC_FOLDER_PATH } from "src/paths/paths";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import * as fs from 'fs';
import { ProcessVideoDto } from "./dto/process-video.dto";

@Controller('video')
export class VideoController {
    constructor(
        private readonly videoService: VideoService,
        private readonly fileUploadService: FileUploadService
    ) { }

    @Post('upload/:projectId')
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(JwtAuthGuard)
    async createVideo(@UploadedFile() file: Express.Multer.File, @Req() req, @Param('projectId') projectId: string) {
        const filesPath = await this.fileUploadService.uploadFile(file, STATIC_FOLDER_PATH + `/${req.user.id}`);

        const outputDir = STATIC_FOLDER_PATH + `/${req.user.id}/thumbnails`;
        await this.fileUploadService.ensureOutputDir(outputDir);
        const thumbnailPath = await this.videoService.generateThumbnail(filesPath, outputDir);

        const duration = await this.videoService.getVideoDuration(filesPath);

        await this.videoService.createVideo({
            title: file.originalname,
            duration: duration,
            filePath: filesPath,
            thumbnailPath:thumbnailPath,
            fileSize: Math.round(file.size / 1024),
            projectId: projectId,
        });

        return { message: 'Video uploaded and thumbnail generated successfully' };
    }

    @Get('project/:projectId')
    async getVideosByProject(@Param('projectId') projectId: string) {
        return this.videoService.findVideosByProject(projectId);
    }

    @Post('process/:id')
    @UseGuards(JwtAuthGuard)
    async processVideo(
        @Req() req,
        @Param('id') id: string,
        @Body() dto: ProcessVideoDto,
        @Res() res: Response
    ) {
        const video = await this.videoService.findVideoById(id);
        if (!video) {
            throw new NotFoundException('Video not found');
        }
        const file = await this.fileUploadService.getFile(video.filePath);
        if (!file) {
            throw new NotFoundException('Video file not found');
        }
        const outputDir = STATIC_FOLDER_PATH + `/${req.user.id}/temp`;

        await this.fileUploadService.ensureOutputDir(outputDir);

        const filePath = await this.videoService.processVideo(video.filePath, dto.type, outputDir, {
            startTime: dto.startTime,
            duration: dto.duration,
        });

        if (!filePath || !fs.existsSync(filePath)) {
            throw new NotFoundException('Processed video file not found');
        }
        const videoStream = fs.createReadStream(filePath);
        res.setHeader('Content-Type', 'video/mp4');
        videoStream.pipe(res);
    }

    @Get(':id')
    async getVideoById(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
        const video = await this.videoService.findVideoById(id);
        if (!video) {
            throw new NotFoundException('Video not found');
        }

        const videoPath = video.filePath;
        const fileExists = await this.fileUploadService.getFile(videoPath);
        if (!fileExists) {
            throw new NotFoundException('Video file not found');
        }

        const stat = fs.statSync(videoPath);
        const fileSize = stat.size;
        const videoRange = req.headers.range;

        if (!videoRange) {
            res.status(416).send('Requires Range header');
            return;
        }

        const chunks = videoRange.replace(/bytes=/, '').split('-');
        const start = parseInt(chunks[0], 10);
        const end = chunks[1] ? parseInt(chunks[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;

        console.log(`bytes ${start}-${end}/${fileSize}`);
        console.log(`chunckSize ${chunksize}`);
        const headers = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };

        res.writeHead(206, headers);
        const videoStream = fs.createReadStream(videoPath, { start, end });
        videoStream.pipe(res);
    }

    @Delete(':id')
    async deleteVideo(@Param('id') id: string) {
        const video = await this.videoService.findVideoById(id);
        if (!video) {
            throw new NotFoundException('Video not found');
        }
        const filePath = video.filePath;
        const fileExists = await this.fileUploadService.getFile(filePath);
        if (!fileExists) {
            throw new NotFoundException('Video file not found');
        }
        const thumbnailPath = video.thumbnailPath;
        const thumbnailExists = await this.fileUploadService.getFile(thumbnailPath);
        if (thumbnailExists) {
            await this.fileUploadService.deleteFile(thumbnailPath);
        }
        await this.fileUploadService.deleteFile(filePath);
        return await this.videoService.deleteVideo(video.id);
    }
}