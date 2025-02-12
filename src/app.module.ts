import { Module } from '@nestjs/common';
import { LoggerModule } from './logger';
import { RabbitModule } from './rmq';
import { SignalConsumer } from './modules/signal/consumer/signal.consumer';

@Module({
  imports: [RabbitModule, LoggerModule],
  controllers: [],
  providers: [SignalConsumer],
})
export class AppModule {}
