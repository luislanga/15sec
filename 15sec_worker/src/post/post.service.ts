import { PostRepository } from '15sec_core/dist/repositories/post.repository';
import { Post } from '15sec_core/generated/prisma/client';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly postRepository: PostRepository,
  ) {}

  async deleteFailedToUploadPosts(): Promise<void> {
    const BATCH_SIZE = Number(this.configService.getOrThrow('DELETE_FAILED_POSTS_BATCH_SIZE'));
    const NEWER_THAN_IN_MS = Number(this.configService.getOrThrow('DELETE_FAILED_POSTS_NEWER_THAN_IN_MS'));
    const OLDER_THAN_IN_MS = Number(this.configService.getOrThrow('DELETE_FAILED_POSTS_OLDER_THAN_IN_MS'));
    const deleteCount = await this.postRepository.deleteFailedToUploadPosts(BATCH_SIZE, NEWER_THAN_IN_MS, OLDER_THAN_IN_MS);

    this.logger.log(`Deleted ${deleteCount} failed to upload posts.`);
  }

  async getManyById(postIds: string[]): Promise<Post[]> {
    return this.postRepository.getManyById(postIds);
  }

  async markPostsCompleted(postIds: string[]): Promise<void> {
    await this.postRepository.updateVideoUploadStatus(postIds);
  }
}
