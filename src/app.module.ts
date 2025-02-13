import { Module } from '@nestjs/common';
import { DatabaseModule } from './infrastructure/database/database.module';
import { LoggerModule } from './logger';
import { SignalModule } from './modules/signal/signal.module';

@Module({
  imports: [DatabaseModule, SignalModule, LoggerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
