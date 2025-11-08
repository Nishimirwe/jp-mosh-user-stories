import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get config service
  const configService = app.get(ConfigService);

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS
  app.enableCors();

  // Setup Swagger documentation (before global prefix)
  const swaggerConfig = new DocumentBuilder()
    .setTitle('MOSH Backend API')
    .setDescription(
      'Modal Shift World - Transportation Planning Simulation Platform API',
    )
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('cities', 'City/Workspace management')
    .addTag('users', 'User management')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app as any, swaggerConfig);
  SwaggerModule.setup('docs', app as any, document, {
    customSiteTitle: 'MOSH API Documentation',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  // Set global prefix (after Swagger setup)
  const apiPrefix = configService.get<string>('apiPrefix') || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // Get port
  const port = configService.get<number>('port') || 3000;

  await app.listen(port);

  console.log(`
  MOSH Backend is running!
  Environment: ${configService.get<string>('nodeEnv')}
  API URL: http://localhost:${port}/${apiPrefix}
  Swagger Docs: http://localhost:${port}/docs
  Health: http://localhost:${port}/${apiPrefix}/health
  `);
}

bootstrap();
