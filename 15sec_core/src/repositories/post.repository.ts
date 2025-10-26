import { Post, PrismaClient } from "generated/prisma";
import { videoUploadStatus } from "../enums/post.enums";
import { CreatePostDto } from "src/dtos/post/create-post.dto";

export class PostRepository {
  constructor(private readonly prisma: PrismaClient) {}

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

  async deleteFailedToUploadPosts(
    batchSize: number,
    newerThanInMs: number,
    olderThanInMs: number,
  ): Promise<number> {
    let deleteCount = 0;

    while (true) {
      const postsToDelete = await this.prisma.post.findMany({
        where: {
          videoUploadStatus: videoUploadStatus.PENDING,
          createdAt: {
            gte: new Date(Date.now() - newerThanInMs), // At least 24 hours old
            lt: new Date(Date.now() - olderThanInMs),  // Less than 48 hours old
          },
        },
        take: batchSize,
      });

      if (postsToDelete.length === 0) {
        break;
      } else {
        await this.prisma.post.deleteMany({
          where: {
            id: { in: postsToDelete.map(post => post.id) },
          },
        });
        deleteCount += postsToDelete.length
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return deleteCount
  }

  async getManyById(postIds: string[]): Promise<Post[]> {
    return this.prisma.post.findMany({
      where: {
        id: { in: postIds },
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