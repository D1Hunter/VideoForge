import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { NestExpressApplication } from '@nestjs/platform-express';
import { STATIC_FOLDER_PATH } from './paths/paths';
import { join } from 'node:path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({credentials:true, origin:true});
  console.log(join(__dirname, '..', 'videos'));
  app.useStaticAssets(join(__dirname, '..', 'videos'), {
    prefix: '/videos/',
  });
  const configService = app.get(ConfigService);
  const PORT = configService.get('port');
  await app.listen(PORT,()=>console.log(`Server started on port: ${PORT}`));
}
bootstrap();