import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class PostStatusUpdateRepository {

  constructor(private readonly prisma: PrismaService) {}

  async updateStatus(postIds: string[]): Promise<void> {
    await this.prisma.post.updateMany({
      data: {
        title: '2nd updated via worker',
      },
      where: {
        id: { in: postIds },
      },
    });
  }
}
