import { Injectable } from '@nestjs/common';
import { Nack, RabbitRPC, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { XRAY_DATA_EXCHANGE, XRAY_DATA_QUEUE } from 'src/common/constant';

@Injectable()
export class SignalConsumer {
  @RabbitRPC({
    exchange: XRAY_DATA_EXCHANGE,
    routingKey: 'xray-data',
    queue: XRAY_DATA_QUEUE,
  })
  public async handleXRayData(message: any) {
    console.log('Received x-ray data:', message);
    return new Nack();
  }
}
