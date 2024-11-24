import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { getUsersMapper } from './mappers/get-users.mapper';
import { ToNumberPipe } from '../../pipes/to-number.pipe';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  @UseGuards(JwtAuthGuard)
  async getAll(
    @Query('limit',ToNumberPipe) limitQ: number = 9,
    @Query('offset',ToNumberPipe) offsetQ: number = 0,
  ) {
    const { limit, offset } = getUsersMapper.fromFrontToController(
      limitQ,
      offsetQ,
    );
    return this.userService.getAll(limit, offset);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param('id') id: string){
    return this.userService.getOneById(id);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getUserProfile(@Request() req){
    return this.userService.getOneById(req.user.id);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async updateUserProfile(@Request() req, @Body() dto:UpdateUserDto){
    return this.userService.update(req.user.id, dto);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    await this.userService.delete(id);
    return { message: `The user ${id} has been deleted successfully` };
  }
}
