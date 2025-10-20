import { Module } from '@nestjs/common';

import { PostStatusUpdateRepository } from './post-status-update.repository';
import { PostStatusUpdateService } from './post-status-update.service';
import { SqsService } from './sqs.service';

@Module({
  providers: [PostStatusUpdateRepository, PostStatusUpdateService, SqsService],
  exports: [SqsService],
})
export class SqsModule {}
