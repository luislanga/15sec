import { Global, Module } from '@nestjs/common';

import { redlockProvider } from './redlock.provider';

@Global()
@Module({
  providers: [redlockProvider],
  exports: [redlockProvider],
})
export class RedlockModule {}
