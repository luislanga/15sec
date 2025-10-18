import { Post } from '15sec_core/generated/prisma/client';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CreatePostDto } from './dtos/create-post.dto';

@Injectable()
export class PostRepository {

  constructor(private readonly prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    return this.prisma.post.create({
      data: {
        title: createPostDto.title,
        videoUrl: createPostDto.videoUrl,
        author: {
          connect: {
            id: createPostDto.authorId,
          },
        },
      },
    });
  }
}
