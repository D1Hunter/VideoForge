import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Video } from "./video.model";
import { VideoController } from "./video.controller";
import { VideoService } from "./video.service";
import { VideoRepository } from "./video.repository";
import { FileUploadModule } from "../file-upload/file-upload.module";
import { FFmpegModule } from "../ffmpeg/ffmpeg.module";

@Module({
  imports: [SequelizeModule.forFeature([Video]), FileUploadModule, FFmpegModule],
  controllers: [VideoController],
  providers: [VideoService, VideoRepository],
  exports: [VideoService]
})
export class VideoModule { }  