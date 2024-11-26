import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Project } from "./project.model";
import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";
import { ProjectRepository } from "./project.repository";

@Module({
    imports: [SequelizeModule.forFeature([Project])],
    controllers: [ProjectController],
    providers: [ProjectService, ProjectRepository],
    exports: [ProjectService]
  })
export class ProjectModule { }  