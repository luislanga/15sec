import { Injectable } from '@nestjs/common';

import { MessageBodyAndReceiptHandle } from '@/interfaces/sqs-message-and-receipt-handle.interface';
import { SqsQueueHandler } from '@/interfaces/sqs-queue-handler.interface';
import { PostService } from '@/post/post.service';


@Injectable()
export class PostStatusUpdateService implements SqsQueueHandler {
  constructor(
    private readonly postService: PostService,
  ) {}

  async handleMessages(messages: MessageBodyAndReceiptHandle[]): Promise<MessageBodyAndReceiptHandle[]> {

    // Maps an S3 type message
    // TODO: create interface for S3 message
    const postIds = messages.map(message => message.body.Records[0].s3.object.key);

    this.postService.markPostsCompleted(postIds);
    
    return messages;
  }
}
