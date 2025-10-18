import { Post } from '15sec_core/generated/prisma';
import { Injectable } from '@nestjs/common';

import { CreatePostDto } from './dtos/create-post.dto';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {

  constructor(private readonly postRepository: PostRepository) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    return this.postRepository.create(createPostDto);
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
