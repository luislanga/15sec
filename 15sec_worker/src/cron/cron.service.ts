import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { PostService } from '@/post/post.service';

@Injectable()
export class CronService {
  constructor(private readonly postService: PostService) {}

  @Cron(CronExpression.EVERY_12_HOURS)
  deleteFailedToUploadPosts() {
    this.postService.deleteFailedToUploadPosts();
  }
}
