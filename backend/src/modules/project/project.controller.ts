import { Body, Controller, Delete, Get, Param, Post, UseGuards, Request, Put } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller('project')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createProject(@Request() req, @Body() dto: CreateProjectDto) {
        return this.projectService.createProject({...dto,userId:req.user.id});
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async editProject(@Param('id') id: string, @Body() dto: CreateProjectDto){
        return this.projectService.editProject(id, dto);
    }

    @Get('user')
    @UseGuards(JwtAuthGuard)
    async getUserProjects(@Request() req) {
        return this.projectService.findAllProjectsByUser(req.user.id);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getProjectById(@Param('id') id: string) {
        return this.projectService.findProjectById(id);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteProject(@Param('id') id: string) {
        console.log(id);
        return this.projectService.deleteProject(id);
    }
}