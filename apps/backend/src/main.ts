import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ConfigService} from '@nestjs/config';
import {ValidationPipe} from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // --- Start of CORS Configuration ---
    app.enableCors({
        origin: function (origin, callback) {
            // In development, allow requests from common local origins.
            // For production, you should restrict this to your frontend's domain.
            const whitelist = [
                'http://localhost:3000', // Next.js frontend
                'http://localhost:5173', // Vite frontend (example)
                undefined // Allow requests with no origin (e.g., Postman, mobile apps)
            ];

            if (whitelist.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                // You can uncomment the line below to block non-whitelisted origins
                // callback(new Error('Not allowed by CORS'));

                // For development, it's often easier to just allow all.
                callback(null, true);
            }
        },
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    // --- End of CORS Configuration ---

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
            whitelist: true,
        }),
    );

    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT') || 3001;

    await app.listen(port);

    console.log(`Backend application is running on: http://localhost:${port}`);
}
bootstrap();