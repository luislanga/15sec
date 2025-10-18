import { Post } from '15sec_core/generated/prisma';
import { Injectable } from '@nestjs/common';

import { S3Service } from '@/s3/s3.service';

import { CreatePostDto } from './dtos/create-post.dto';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {

  constructor(
    private readonly postRepository: PostRepository,
    private readonly s3Service: S3Service,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post & { presignedUrl: string }> {
    const createdPost = await this.postRepository.create(createPostDto);
    
    const presignedUrl = await this.s3Service.getPresignedUploadUrl(createdPost.id);

    return {...createdPost, presignedUrl};
  }

  findAll() {
    return 'This action returns all post';
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto) {
    return `This action updates a #${id} post and ${updatePostDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
