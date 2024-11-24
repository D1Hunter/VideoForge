import { Injectable } from "@nestjs/common";
import { Video } from "./video.model";
import { BaseAbstractRepository } from "../../interfaces/base.abstract.repository";
import { InjectModel } from "@nestjs/sequelize";

@Injectable()
export class VideoRepository extends BaseAbstractRepository<Video> {
  constructor(@InjectModel(Video) videoModel: typeof Video) {
    super(videoModel);
  }
}
