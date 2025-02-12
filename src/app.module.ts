import { Module } from '@nestjs/common';
import { LoggerModule } from './logger';
import { RabbitModule } from './rmq';
import { SignalConsumer } from './modules/signal/consumer/signal.consumer';
import { SignalModule } from './modules/signal/signal.module';
import { DatabaseModule } from './infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule, SignalModule, LoggerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
