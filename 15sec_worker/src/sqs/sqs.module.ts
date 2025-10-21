import { Module } from '@nestjs/common';

import { PostModule } from '@/post/post.module';

import { PostStatusUpdateService } from './post-status-update.service';
import { SqsService } from './sqs.service';

@Module({
  imports: [PostModule],
  providers: [PostStatusUpdateService, SqsService],
  exports: [SqsService],
})
export class SqsModule {}
