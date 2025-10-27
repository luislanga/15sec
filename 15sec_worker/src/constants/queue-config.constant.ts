import { PostStatusUpdateService } from '@/sqs/post-status-update.service';

export const QUEUE_CONFIG = [
  {
    envVar: 'POST_UPLOADS_QUEUE_URL',
    handler: PostStatusUpdateService,
    name: 'post-status-update',
    batchSizeEnvVar: 'POST_UPLOADS_QUEUE_BATCH_SIZE',
    flushTimeoutMsEnvVar: 'POST_UPLOADS_QUEUE_FLUSH_TIMEOUT_MS',
  },
];
