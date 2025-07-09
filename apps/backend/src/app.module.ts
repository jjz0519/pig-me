import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config'; // <-- 1. 导入 ConfigModule
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {PrismaService} from './prisma.service';
import {AuthModule} from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}