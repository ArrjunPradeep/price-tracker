import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Price Tracker API')
    .setDescription('Track crypto prices and send alerts')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup('swagger', app, document, {
    yamlDocumentUrl: 'swagger/yaml',
    jsonDocumentUrl: 'swagger/json'
  });  
  
  await app.listen(3369);
}
bootstrap();