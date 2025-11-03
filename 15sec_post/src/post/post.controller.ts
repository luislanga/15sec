import { CreatePostDto } from '15sec_core/dist/dtos/post/create-post.dto';
import { Body, Controller, Post } from '@nestjs/common';

import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }
}
