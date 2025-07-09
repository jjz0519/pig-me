import {Module} from '@nestjs/common';
import {PrismaService} from './prisma.service';

@Module({
    providers: [PrismaService], // Provide PrismaService in this module
    exports: [PrismaService],   // Export PrismaService so other modules can use it
})
export class PrismaModule {
}