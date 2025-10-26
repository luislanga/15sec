import { Module } from '@nestjs/common';

import { PostModule } from '@/post/post.module';

import { CronService } from './cron.service';

@Module({
  imports: [PostModule],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
