import {Injectable, OnModuleInit} from '@nestjs/common';
import {PrismaClient} from '@repo/database';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        // This is optional, but good practice.
        // It ensures a connection can be established on starting up.
        await this.$connect();
    }
}