import { Injectable } from '@nestjs/common';

import { MessageBodyAndReceiptHandle } from '@/interfaces/sqs-message-and-receipt-handle.interface';
import { SqsQueueHandler } from '@/interfaces/sqs-queue-handler.interface';

import { PostStatusUpdateRepository } from './post-status-update.repository';

@Injectable()
export class PostStatusUpdateService implements SqsQueueHandler {
  constructor(
    private readonly postStatusUpdateRepository: PostStatusUpdateRepository,
  ) {}

  async handleMessages(messages: MessageBodyAndReceiptHandle[]): Promise<MessageBodyAndReceiptHandle[]> {

    // Maps an S3 type message
    // TODO: consider creating interfaces for different types of messages (will require generic on polling function or refactor)
    const postIds = messages.map(message => message.body.Records[0].s3.object.key);

    this.postStatusUpdateRepository.updateStatus(postIds);
    
    return messages;
  }
}
