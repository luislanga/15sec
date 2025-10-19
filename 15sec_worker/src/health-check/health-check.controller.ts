import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthCheckController {
  @Get()
  healthCheck() {
    return 'Worker Server is Running.';
  }
}
