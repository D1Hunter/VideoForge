import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors, Request } from "@nestjs/common";
import { VideoService } from "./video.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileUploadService } from "../file-upload/file-upload.service";
import { STATIC_FOLDER_PATH } from "src/paths/paths";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

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
        await this.videoService.createVideo({ 
            title: file.originalname, 
            duration: 0, 
            filePath: filesPath, 
            fileSize: Math.round(file.size / 1024), 
            projectId: projectId 
        });
    }

    @Get('project/:projectId')
    async getVideosByProject(@Param('projectId') projectId: string) {
        return this.videoService.findVideosByProject(projectId);
    }

    @Get(':id')
    async getVideoById(@Param('id') id: string) {
        return this.videoService.findVideoById(id);
    }

    @Delete(':id')
    async deleteVideo(@Param('id') id: string) {
        return this.videoService.deleteVideo(id);
    }
}