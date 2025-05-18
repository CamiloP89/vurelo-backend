import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { execSync } from 'child_process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'production' || process.env.RUN_MIGRATIONS === 'true') {
    try {
      console.log(' Ejecutando migraciones Prisma...');
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    } catch (err) {
      console.error(' Error ejecutando migraciones:', err);
    }
  }

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Vurelo API')
    .setDescription('Documentación Swagger de la API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Validaciones globales
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
