import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import Redlock from 'redlock';

export const redlockProvider: Provider = {
  provide: 'REDLOCK',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const redlockConfig = {
      driftFactor: 0.01,
      retryCount: 0,
      retryDelay: 200,
    };
    
    const host = configService.getOrThrow('REDIS_HOST');
    const port = Number(configService.getOrThrow('REDIS_PORT'));
    const client = new Redis({ host, port });

    return new Redlock([client], {
      ...redlockConfig,
    });
  },
};
