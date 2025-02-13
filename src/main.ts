import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { config } from './config';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionFilter } from './common/filter';
import { ResponseInterceptor } from './common/Interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = app.get(Logger);

  app.useLogger(logger);
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  const PORT = config.app.port;

  const options = new DocumentBuilder()
    .setTitle('Iot Processor')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(config.app.docPath, app, document);

  await app.listen(PORT);
  logger.log(`Application is running on ${await app.getUrl()}...`);
}
bootstrap();
