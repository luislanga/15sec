import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PostModule } from '@/post/post.module';
import { PrismaModule } from '@/prisma/prisma.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    PostModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
