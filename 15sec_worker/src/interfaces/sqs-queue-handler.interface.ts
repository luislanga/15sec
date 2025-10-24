import { MessageBodyAndReceiptHandle } from './sqs-message-and-receipt-handle.interface';

export interface SqsQueueHandler {
  handleMessages(messages: MessageBodyAndReceiptHandle[]): Promise<MessageBodyAndReceiptHandle[] | []>
}
