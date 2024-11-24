import { Injectable } from "@nestjs/common";
import { Project } from "./project.model";
import { InjectModel } from "@nestjs/sequelize";
import { BaseAbstractRepository } from "../../interfaces/base.abstract.repository";

@Injectable()
export class ProjectRepository extends BaseAbstractRepository<Project> {
  constructor(@InjectModel(Project) projectModel: typeof  Project) {
    super(projectModel);
  }
}