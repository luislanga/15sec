import { PostRepository } from '15sec_core/dist/repositories/post.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async markPostsCompleted(postIds: string[]) {
    await this.postRepository.updateVideoUploadStatus(postIds);
  }
}
