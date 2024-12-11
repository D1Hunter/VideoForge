import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors, Res, NotFoundException, StreamableFile, Req, HttpCode, HttpStatus } from "@nestjs/common";
import { Request, Response } from 'express';
import { VideoService } from "./video.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileUploadService } from "../file-upload/file-upload.service";
import { STATIC_FOLDER_PATH } from "src/paths/paths";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ProcessVideoDto } from "./dto/process-video.dto";

@Controller('video')
export class VideoController {
    constructor(
        private readonly videoService: VideoService,
    ) { }

    @Post('upload/:projectId')
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(JwtAuthGuard)
    async uploadVideo(@UploadedFile() file: Express.Multer.File, @Req() req, @Param('projectId') projectId: string) {
        return this.videoService.handleVideoUpload(file, req.user.id, projectId, STATIC_FOLDER_PATH);
    }

    @Get('project/:projectId')
    async getVideosByProject(@Param('projectId') projectId: string) {
        return this.videoService.findVideosByProject(projectId);
    }

    @Post('process/:id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async processVideo(
        @Req() req,
        @Param('id') id: string,
        @Body() dto: ProcessVideoDto,
        @Res() res: Response
    ) {
        console.log(dto);
        return await this.videoService.handleVideoProcessing(id, req.user.id, dto, STATIC_FOLDER_PATH, req, res);
    }

    @Get(':id')
    async getVideoById(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
        console.log("Aboba");
        await this.videoService.handleGetVideoById(id, req, res);
    }

    @Delete(':id')
    async deleteVideo(@Param('id') id: string) {
        await this.videoService.deleteVideoById(id);
        return { message: 'Video successfully deleted' };
    }
}