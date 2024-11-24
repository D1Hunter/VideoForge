import { Injectable } from "@nestjs/common";
import { CreateProjectDto } from "./dto/create-project.dto";
import { Project } from "./project.model";
import { ProjectRepository } from "./project.repository";

@Injectable()
export class ProjectService {
    constructor(
        private prjectRepository: ProjectRepository
    ) { }

    async createProject(dto: CreateProjectDto): Promise<Project> {
        return this.prjectRepository.create({ ...dto });
    }

    async findAllProjectsByUser(userId: string): Promise<Project[]> {
        return this.prjectRepository.findMany({ where: { userId }, include: ['videos'] });
    }

    async findProjectById(id: string): Promise<Project> {
        return this.prjectRepository.findOneById(id);
    }

    async deleteProject(id: string): Promise<number> {
        return this.prjectRepository.delete(id);
    }
}