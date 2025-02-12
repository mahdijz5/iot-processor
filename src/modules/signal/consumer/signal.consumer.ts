import { Injectable, Logger } from '@nestjs/common';
import { Nack, RabbitRPC, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { XRAY_DATA_EXCHANGE, XRAY_DATA_QUEUE } from 'src/common/constant';
import { SignalConsumedDataType } from '../types/signal-data.type';
import { SignalTransformService } from '../service/signal-transform.service';

@Injectable()
export class SignalConsumer {
  constructor(
    private readonly signalTransformService: SignalTransformService,
  ) {}
  private readonly logger = new Logger(SignalConsumer.name);
  @RabbitRPC({
    exchange: XRAY_DATA_EXCHANGE,
    routingKey: 'xray-data',
    queue: XRAY_DATA_QUEUE,
  })
  public async handleXRayData(message: SignalConsumedDataType) {
    try {
      this.logger.log('Received x-ray' + JSON.stringify(message));
      SignalConsumedDataType.schema.parse(message);
      this.signalTransformService.dataProcessor(message);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
