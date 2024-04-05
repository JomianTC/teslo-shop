import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {

	const app = await NestFactory.create(AppModule);
	const logger = new Logger( "Bootstrap" );

	app.setGlobalPrefix("api");
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
		})
	);

	// Configuracion del SWAGGER
	const config = new DocumentBuilder()
		.setTitle( "Teslo Restful API" )
		.setDescription( "Teslo Shop endpoints" )
		.setVersion( "1.0" )
		.build();

	const document = SwaggerModule.createDocument( app, config );
	SwaggerModule.setup( "api", app, document );

	await app.listen( process.env.PORT );
	logger.log( `Server running in port ${ process.env.PORT }` );
}

bootstrap();