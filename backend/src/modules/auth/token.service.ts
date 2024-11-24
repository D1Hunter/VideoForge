import { Injectable } from '@nestjs/common';
import { TokenPayload } from './token.type';
import { JwtService } from '@nestjs/jwt';
import { TokenRepository } from './token.repository';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly tokenRepository: TokenRepository,
  ) {}
  
  generateAccessToken(payload: TokenPayload) {
    return this.jwtService.signAsync(payload);
  }

  async saveToken(userId: string, accessToken: string) {
    const token = await this.tokenRepository.findOneByUserId(userId);
    if (!token) {
      return this.tokenRepository.create({
        accessToken,
        userId,
      });
    }
    return this.tokenRepository.update(token, {
      accessToken,
      lastAuthorization: new Date(),
    });
  }

  async deleteAccessToken(userId:string) {
    const token = await this.tokenRepository.findOneByUserId(userId);
    return this.tokenRepository.delete(token.id);
  }
}
