import { Injectable } from '@nestjs/common';

import { MessageBodyAndReceiptHandle } from '@/interfaces/sqs-message-and-receipt-handle.interface';
import { SqsQueueHandler } from '@/interfaces/sqs-queue-handler.interface';
import { PostService } from '@/post/post.service';

@Injectable()
export class PostStatusUpdateService implements SqsQueueHandler {
  constructor(
    private readonly postService: PostService,
  ) {}

  async handleMessages(messages: MessageBodyAndReceiptHandle[]): Promise<MessageBodyAndReceiptHandle[] | []> {
    // Maps an S3 type message
    // TODO: create interface for S3 message
    const postIds = messages.map(message => message.body.Records[0].s3.object.key);

    const processablePostIds = (await this.postService.getManyById(postIds)).map(post => post.id);

    // Using a set is more verbose, but it's O(1) for lookups instead of O(n) with array.includes
    const processableSet = new Set(processablePostIds);

    if (processablePostIds.length > 0) {
      await this.postService.markPostsCompleted(processablePostIds);
      
      /**
       * If using array.includes for filtering with arrays of 1000 items, this could do 1000 * 1000 = 1,000,000
       * comparisons, but with the hash set, it's only 1000 + 1000 = 2,000 operations (O(n + m))
       */ 
      const processedMessages = messages.filter(message => processableSet.has(message.body.Records[0].s3.object.key));

      return processedMessages;
    }

    return [];
  }
}
