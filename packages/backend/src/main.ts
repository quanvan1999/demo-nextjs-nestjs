import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import path, { resolve } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { generateApi } from 'swagger-typescript-api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT') ?? 3001;

  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription(`Powered by QV`)
    .setVersion('1.0.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Account Token',
    })
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
      defaultModelsExpandDepth: -1, // no models shown
      defaultModelExpandDepth: -1, // no model properties shown,
      syntaxHighlight: false,
    },
  });

  const docPath = path.resolve(__dirname, '../../docs/');

  if (!existsSync(docPath)) {
    mkdirSync(docPath, { recursive: true });
  }

  writeFileSync(resolve(docPath, 'api-spec.json'), JSON.stringify(documentFactory(), null, 2));

  await generateApi({
    name: 'sdk',
    output: path.resolve(__dirname, '../../frontend/src/api'),
    spec: documentFactory() as any,
    prettier: {
      singleQuote: true,
      jsxSingleQuote: false,
      arrowParens: 'avoid',
      trailingComma: 'all',
      tabWidth: 2,
      printWidth: 100,
      parser: 'typescript',
      unwrapResponseData: true,
    },
    httpClientType: 'axios',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix('api/v1', {
    exclude: [''],
  });

  await app.listen(port, () => {
    Logger.log(`🚀 API server listenning on http://localhost:${port}/api`, 'Bootstrap');
  });
}
bootstrap();
