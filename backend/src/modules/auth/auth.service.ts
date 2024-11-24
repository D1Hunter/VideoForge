import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserRepository } from '../user/user.repository';
import { LoginUserDto } from './dto/login-user.dto';
import { randomBytes, scrypt } from 'node:crypto';

@Injectable()
export class AuthService {
    constructor(private readonly userRepository: UserRepository) { }
    
    async register(dto: RegisterUserDto) {
        const user = await this.userRepository.findOneByEmail(dto.email);
        if (user) {
            throw new HttpException('This email is already in use.', HttpStatus.BAD_REQUEST);
        }
        const hashPassword = await this.hashPassword(dto.password);
        const newUser = await this.userRepository.create({ ...dto, password: hashPassword });
        return newUser;
    }

    async login(dto: LoginUserDto) {
        const user = await this.userRepository.findOneByEmail(dto.email);
        if (!user) {
            throw new HttpException('Incorrect data input.', HttpStatus.BAD_REQUEST);
        }
        const comparePassword = await this.comparePasswords(dto.password, user.password);
        if (!comparePassword) {
            throw new HttpException('Incorrect data input.', HttpStatus.BAD_REQUEST);
        }
        return user;
    }

    async auth(userId:string) {
        const user = await this.userRepository.findOneById(userId);
        if (!user) {
            throw new HttpException('Incorrect data input.', HttpStatus.BAD_REQUEST);
        }
        return user;
    }

    private async hashPassword(password:string):Promise<string> {
        const salt = randomBytes(16).toString('hex');
        const keylen = 64;
        return new Promise((resolve, reject) => {
          scrypt(password, salt, keylen, (err, derivedKey) => {
            if (err) reject(err);
            resolve(`${salt}:${derivedKey.toString('hex')}`);
          });
        });
      }
      
    private async comparePasswords(password: string, storedPassword: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const [salt, key] = storedPassword.split(":")
            scrypt(password, salt, 64, (err, derivedKey) => {
                if (err) reject(err);
                resolve(key == derivedKey.toString('hex'))
            });
        })
    }
}
