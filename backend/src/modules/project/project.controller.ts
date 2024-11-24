import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { CreateProjectDto } from "./dto/create-project.dto";

@Controller('project')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) { }

    @Post()
    async createProject(@Body() dto: CreateProjectDto) {
        return this.projectService.createProject(dto);
    }

    @Get('user/:userId')
    async getUserProjects(@Param('userId') userId: string) {
        return this.projectService.findAllProjectsByUser(userId);
    }

    @Get(':id')
    async getProjectById(@Param('id') id: string) {
        return this.projectService.findProjectById(id);
    }

    @Delete(':id')
    async deleteProject(@Param('id') id: string) {
        return this.projectService.deleteProject(id);
    }
}