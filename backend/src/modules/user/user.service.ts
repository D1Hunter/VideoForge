import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  getAll(limit: number, offset: number): Promise<User[]> {
    return this.userRepository.findMany({limit,offset});
  }

  getOneByEmail(email:string): Promise<User>{
    const user = this.userRepository.findOneByEmail(email);
    if(!user){
      throw new NotFoundException('User with this email is not exist');
    }
    return user;
  }

  getOneById(id:string):Promise<User>{
    const user = this.userRepository.findOneById(id);
    if(!user){
      throw new NotFoundException('User with this id is not exist');
    }
    return user;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.findOneByEmail(dto.email);
    if (user) {
      throw new NotFoundException('User with this email already exist');
    }
    return this.userRepository.create({ ...dto });
  }

  async update(id:string, dto:UpdateUserDto): Promise<User>  {
    const user = await this.userRepository.findOneById(id);
    if(!user){
      throw new NotFoundException('User with this id is not exist');
    }
    return this.userRepository.update(user,{...dto});
  }

  delete(id: string): Promise<Number> {
    return this.userRepository.delete(id);
  }
}