import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { Token } from './token.model';
import { TokenService } from './token.service';
import { TokenRepository } from './token.repository';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'jwtsecret',
      signOptions: {
        expiresIn: '1h',
      },
    }),
    SequelizeModule.forFeature([Token]),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, TokenRepository],
  exports:[TokenRepository]
})
export class AuthModule {}
