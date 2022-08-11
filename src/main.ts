import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LogLevel, ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExceptionFilter } from 'ameixa-shared/ExceptionFilter';

const isProd = process.env.NODE_ENV === 'production';
const isStaging = process.env.NODE_ENV === 'staging';

const prefix = isProd || isStaging ? 'api/location' : undefined;

async function bootstrap() {
  const logLevel: LogLevel[] = ['log', 'error', 'verbose', 'warn'];
  const logLevelDevelopment: LogLevel[] = isProd ? [] : ['debug'];

  const port = Number(process.env.PORT);
  const app = await NestFactory.create(AppModule, { logger: [...logLevel, ...logLevelDevelopment]});

  const { httpAdapter } = app.get(HttpAdapterHost);

  if (!isProd)
    app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: true }));
  app.useGlobalFilters(new ExceptionFilter(httpAdapter));

  if(!!prefix)
    app.setGlobalPrefix(prefix);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  const swaggerOptions = new DocumentBuilder()
      .setTitle('Frexco - Location')
      .setDescription('Api para gerenciar os locais de entrega e servicos de geolocations')
      .addBearerAuth()
      .build();

  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup(`${prefix ? `/${prefix}` : ''}/swagger`, app, document);

  await app.listen(port);

  console.log('******************************');
  console.log(`        SERVER STARTED        `);
  console.log(`    Listening on port ${port} `);
  console.log('******************************');
}

bootstrap()
    .catch(console.error);
