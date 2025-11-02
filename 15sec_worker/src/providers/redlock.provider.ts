import { Provider } from '@nestjs/common';
import Redis from 'ioredis';
import Redlock from 'redlock';

export const redlockProvider: Provider = {
  provide: 'REDLOCK',
  useFactory: () => {
    // TODO get host and port from env
    const client = new Redis({ host: 'localhost', port: 6379 });

    return new Redlock([client], {
      // TODO: put magic numbers in consts
      driftFactor: 0.01,
      retryCount: 3,
      retryDelay: 200,
    });
  },
};
