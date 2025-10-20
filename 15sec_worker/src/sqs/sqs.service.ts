import { Message, ReceiveMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { Injectable, Logger, OnModuleDestroy, OnModuleInit, Type } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';

import { QUEUE_CONFIG } from '@/constants/queue-config.constant';
import { MessageBodyAndReceiptHandle } from '@/interfaces/sqs-message-and-receipt-handle.interface';
import { SqsQueueHandler } from '@/interfaces/sqs-queue-handler.interface';


@Injectable()
export class SqsService implements OnModuleInit, OnModuleDestroy {
  
  private readonly sqs: SQSClient;
  private readonly queueLoops: Record<string, boolean> = {};
  private readonly logger = new Logger(SqsService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly moduleReference: ModuleRef,
  ) {
    this.sqs = new SQSClient({
      region: this.configService.getOrThrow('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  getMessageBodyAndReceiptHandle(message: Message): MessageBodyAndReceiptHandle {
    if(!message.Body) {
      throw new Error (`Message ${message.MessageId} has no body`);
    }

    if(!message.ReceiptHandle) {
      throw new Error (`Message ${message.MessageId} has no receipt handle`);
    }

    const body = JSON.parse(message.Body);

    return { body, receiptHandle: message.ReceiptHandle };
  }

  /**
   * The following method is called when NestJS initiates, then each item in
   * the QUEUE_CONFIG constant gets it's own listener.
   */
  async onModuleInit() {
    for (const queue of QUEUE_CONFIG) {
      const queueUrl = this.configService.getOrThrow(queue.envVar);
      const batchSize = Number(this.configService.get(queue.batchSizeEnvVar));
      const flushTimeoutMs = Number(this.configService.get(queue.flushTimeoutMsEnvVar));
      const handlerInstance = this.moduleReference.get(queue.handler as Type<SqsQueueHandler>, {strict: false});

      this.startBatchPolling(queueUrl, handlerInstance, queue.name, batchSize, flushTimeoutMs);
    }
  }


  /**
   * Starts polling an SQS queue and processes messages in batches.
   *
   * This method continuously receives messages from the specified SQS queue,
   * buffers them up to the configured batch size or flush timeout, and passes
   * them to the provided handler (all handlers must return an array with the
   * messages that faield to be processed by default). Only messages successfully
   * processed by the handler are deleted from SQS. Failed messages remain in the 
   * queue for retry according to SQS visibility timeout and eventually end up in 
   * the provided DLQ.
   *
   * @param queueUrl - The full URL of the SQS queue to poll, provided in the .env file.
   * @param handler - An object implementing `handleMessage(messages: string[]): Promise<string[]>` 
   *                  where the handler returns an array of ids that failed processing.
   * @param queueName - A human-readable name for the queue, used in logs.
   * @param batchSize - Maximum number of messages to process in a single batch (default = 1).
   * @param flushTimeoutMs - Maximum time in milliseconds to wait before processing an incomplete 
   *                         batch (default = 0, meaning no timeout).
   */
  async startBatchPolling(
    queueUrl: string,
    handler: SqsQueueHandler,
    queueName: string,
    batchSize = 1,
    flushTimeoutMs = 0,
  ) {
    this.queueLoops[queueName] = true;
    
    let batch: MessageBodyAndReceiptHandle[] = [];
    let batchStartTime: number | null = null;
    let isFlushing = false;

    // TODO: type the return
    const flushBatch = async () => {
      if (batch.length === 0) {
        batchStartTime = null;

        return; 
      }

      isFlushing = true;

      const currentBatch = [...batch];

      batch = [];
      batchStartTime = null;

      this.logger.log(`[${queueName}] flushing ${currentBatch.length} messages`);

      try {
        const hanlderResponse = await handler.handleMessages(currentBatch);
        
        return hanlderResponse;
      } catch (error) {
        this.logger.error(`[${queueName}] handler error during flush`, error);

        return currentBatch;
      } finally {
        isFlushing = false;
      }
    };

    const command = new ReceiveMessageCommand({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: Math.min(batchSize, this.configService.getOrThrow('SQS_MAX_NUMBER_OF_MESSAGES')),
      WaitTimeSeconds: this.configService.getOrThrow('SQS_WAIT_TIME_IN_SECONDS'),
    });

    while(this.queueLoops[queueName]) {
      if (
        !isFlushing &&
        flushTimeoutMs > 0 &&
        batchStartTime !== null &&
        Date.now() >= (batchStartTime + flushTimeoutMs)
      ) {
        this.logger.log(`[${queueName}] flushing due to timeout (${flushTimeoutMs}ms elapsed).`);
        try {
          await flushBatch(); 
        } catch (error) {
          this.logger.error(`[${queueName}] timeout flush failed`, error);
        }
        continue;
      }
      if (!isFlushing) {
        try {
          const response = await this.sqs.send(command);
  
          if (response.Messages && response.Messages.length > 0) {
            this.logger.log(`[${queueName}] received ${response.Messages.length} messages`);
            
            // Set batch start time if this is the first message
            if (batch.length === 0) {
              batchStartTime = Date.now();
            }

            for (const message of response.Messages) {
              const messageBodyAndReceiptHandle = this.getMessageBodyAndReceiptHandle(message);

              batch.push(messageBodyAndReceiptHandle);
            }
            
            // Check for size-based flush
            if (batch.length >= batchSize) {
              this.logger.log(`[${queueName}] Flushing due to batch size (${batch.length}/${batchSize}).`);
              await flushBatch(); 
            }
          }
        } catch (error) {
          this.logger.error(`[${queueName}] SQS receive error`, error);
          // The following delay prevents thrashing the SQS API on persistent failure to call
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
    }
  }

  onModuleDestroy() {
    throw new Error('Method not implemented.');
  }

}
