import { Module } from '@nestjs/common';

import { SignalTransformService } from './service/signal-transform.service';
import { SignalConsumer } from './consumer/signal.consumer';
import { RabbitModule } from 'src/rmq';
import { InjectTokenEnum } from 'src/common/enum';
import { SignalManager } from 'src/infrastructure/database/manager/signal.manager';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SignalModel,
  SignalSchema,
} from 'src/infrastructure/database/schemas/signal.schema';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { SignalService } from './service/signal.service';
import { SignalController } from './controller/signal.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SignalModel.name,
        schema: SignalSchema,
      },
    ]),
    DatabaseModule,
    RabbitModule,
  ],
  controllers: [SignalController],
  providers: [
    SignalConsumer,
    SignalTransformService,
    SignalService,
    {
      provide: InjectTokenEnum.SIGNAL_MANAGER,
      useClass: SignalManager,
    },
  ],
})
export class SignalModule {}
