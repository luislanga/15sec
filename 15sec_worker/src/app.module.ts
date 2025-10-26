import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { CronModule } from './cron/cron.module';
import { HealthCheckModule } from './health-check/health-check.module';
import { PrismaModule } from './prisma/prisma.module';
import { SqsModule } from './sqs/sqs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CronModule,
    HealthCheckModule,
    PrismaModule,
    ScheduleModule.forRoot(),
    SqsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
