import { Injectable } from "@nestjs/common";
import { VideoRepository } from "./video.repository";
import { CreateVideoDto } from "./dto/create-video.dto";
import { Video } from "./video.model";

@Injectable()
export class VideoService {
    constructor(private videoRepository: VideoRepository) { }

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