import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import Redlock from 'redlock';

import { PostService } from '@/post/post.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger();

  constructor(
    @Inject('REDLOCK')
    private readonly redlock: Redlock,
    private readonly postService: PostService,
  ) {}

  @Cron(CronExpression.EVERY_12_HOURS)
  async deleteFailedToUploadPosts() {
    this.logger.log('Running Delete Failed to Upload Posts cron job');
    try {
      await this.redlock.acquire(['locks:deleteFailedPosts'], 1000 * 60 * 10);
      await this.postService.deleteFailedToUploadPosts();
    } catch (error) {
      if (error instanceof Error && error.name === 'LockError') {
        this.logger.log('Skipping failed to upload post deletions');
      } else {
        throw error;
      }
    }
  }
}
