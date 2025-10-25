import { PostRepository } from '15sec_core/dist/repositories/post.repository';
import { Module } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { PostService } from './post.service';

@Module({
  providers: [PostService,
    /**
     * PostRepository comes from 15sec_core and is instantiated with a Prisma client.
     * Here, PrismaService is a NestJS provider using 15sec_core’s own Prisma client,
     * which ships with the library. If needed, a different PrismaClient instance could
     * be created and injected into the repository instead.
     */
    {
      provide: PostRepository,
      useFactory: (prisma: PrismaService) => new PostRepository(prisma),
      inject: [PrismaService],
    },
  ],
  exports: [PostService],
})
export class PostModule {}
