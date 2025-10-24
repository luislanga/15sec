import { Post, PrismaClient } from "generated/prisma";
import { videoUploadStatus } from "../enums/post.enums";
import { CreatePostDto } from "src/dtos/post/create-post.dto";

export class PostRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getManyById(postIds: string[]): Promise<Post[]> {
    return this.prisma.post.findMany({
      where: {
        id: { in: postIds },
      },
    });
  }

  async create(createPostDto: CreatePostDto): Promise<Post> {
    return this.prisma.post.create({
      data: {
        title: createPostDto.title,
        author: {
          connect: {
            id: createPostDto.authorId,
          },
        },
      },
    });
  }

  async updateVideoUploadStatus(postIds: string[]): Promise<void> {
    await this.prisma.post.updateMany({
      data: {
        videoUploadStatus: videoUploadStatus.COMPLETED,
      },
      where: {
        id: { in: postIds },
        videoUploadStatus: videoUploadStatus.PENDING,
      },
    });
  }
}