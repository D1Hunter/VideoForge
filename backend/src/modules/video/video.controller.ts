import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors, Request, Res, NotFoundException, StreamableFile } from "@nestjs/common";
import { Response } from 'express';
import { VideoService } from "./video.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileUploadService } from "../file-upload/file-upload.service";
import { STATIC_FOLDER_PATH } from "src/paths/paths";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { createReadStream } from "fs";

@Controller('video')
export class VideoController {
    constructor(
        private readonly videoService: VideoService,
        private readonly fileUploadService: FileUploadService
    ) { }

    @Post('upload/:projectId')
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(JwtAuthGuard)
    async createVideo(@UploadedFile() file: Express.Multer.File, @Request() req, @Param('projectId') projectId: string) {
        const filesPath = await this.fileUploadService.uploadFile(file, STATIC_FOLDER_PATH + `/${req.user.id}`);

        const outputDir = STATIC_FOLDER_PATH + `/${req.user.id}/thumbnails`;
        const thumbnailPath = await this.videoService.generateThumbnail(filesPath, outputDir);
        const duration = await this.videoService.getVideoDuration(filesPath);

        await this.videoService.createVideo({
            title: file.originalname,
            duration: duration,
            filePath: filesPath,
            fileSize: Math.round(file.size / 1024),
            projectId: projectId,
        });

        return { message: 'Video uploaded and thumbnail generated successfully' };
    }

    @Get('project/:projectId')
    async getVideosByProject(@Param('projectId') projectId: string) {
        return this.videoService.findVideosByProject(projectId);
    }

    @Get(':id')
    async getVideoById(@Param('id') id: string, @Res() res: Response) {
        const video = await this.videoService.findVideoById(id);
        if (!video) {
            throw new NotFoundException('Video not found');
        }

        const filePath = video.filePath;
        const fileExists = await this.fileUploadService.getFile(filePath);
        if (!fileExists) {
            throw new NotFoundException('Video file not found');
        }

        const videoStream = createReadStream(filePath);
        res.setHeader('Content-Type', 'video/mp4');
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
        await this.fileUploadService.deleteFile(filePath);
        return await this.videoService.deleteVideo(video.id);
    }
}