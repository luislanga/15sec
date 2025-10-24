import { PostRepository } from '15sec_core/dist/repositories/post.repository';
import { Post } from '15sec_core/generated/prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async getManyById(postIds: string[]): Promise<Post[]> {
    return this.postRepository.getManyById(postIds);
  }

  async markPostsCompleted(postIds: string[]): Promise<void> {
    await this.postRepository.updateVideoUploadStatus(postIds);
  }
}
