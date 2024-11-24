import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { VideoService } from "./video.service";
import { domainToASCII } from "url";
import { CreateVideoDto } from "./dto/create-video.dto";

@Controller('videos')
export class VideoController {
    constructor(private readonly videoService: VideoService) { }

    @Post()
    async createVideo(@Body() dto: CreateVideoDto) {
        return this.videoService.createVideo(dto);
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