import * as dotenv from 'dotenv';
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import configurations from "./configurations";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./modules/user/user.model";
import { Token } from "./modules/auth/token.model";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "./modules/user/user.module";
import { AuthModule } from "./modules/auth/auth.module";
import { JwtStrategy } from "./modules/auth/strategies/jwt.strategy";
import { Project } from './modules/project/project.model';
import { ProjectModule } from './modules/project/project.module';
import { VideoModule } from './modules/video/video.module';
import { Video } from './modules/video/video.model';
import { FileUploadModule } from './modules/file-upload/file-upload.module';
import { FFmpegModule } from './modules/ffmpeg/ffmpeg.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      load: [configurations]
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: "postgres",
        host: configService.get("DB_HOST"),
        port: configService.get("DB_PORT"),
        username: configService.get("DB_USER"),
        password: configService.get("DB_PASSWORD"),
        database: configService.get("DB_NAME"),
        synchronize: true,
        autoLoadModels: true,
        models: [
          User,
          Token,
          Project,
          Video
        ]
      })
    }),
    PassportModule,
    UserModule,
    AuthModule,
    ProjectModule,
    VideoModule,
    FileUploadModule,
    FFmpegModule],
  providers: [JwtStrategy],
})

export class AppModule { }