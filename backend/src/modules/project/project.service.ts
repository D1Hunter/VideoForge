import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateProjectDto } from "./dto/create-project.dto";
import { Project } from "./project.model";
import { ProjectRepository } from "./project.repository";

@Injectable()
export class ProjectService {
    constructor(
        private projectRepository: ProjectRepository
    ) { }

    async createProject(dto: CreateProjectDto): Promise<Project> {
        return this.projectRepository.create({ ...dto });
    }

    async editProject(id: string, dto: CreateProjectDto): Promise<Project> {
        const project = await this.findProjectById(id);
        if (!project) {
            throw new NotFoundException('Project with this id is not exist');
        }
        return this.projectRepository.update(project, { ...dto });
    }

    async findAllProjectsByUser(userId: string): Promise<Project[]> {
        return this.projectRepository.findMany({ where: { userId } });
    }

    async findProjectById(id: string): Promise<Project> {
        return this.projectRepository.findOneById(id);
    }

    async deleteProject(id: string) {
        return this.projectRepository.delete(id);
    }
}