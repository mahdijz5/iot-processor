import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { config } from 'src/config';
import { XRAY_DATA_EXCHANGE } from 'src/common/constant';

@Module({
  imports: [
    RabbitMQModule.forRoot({
      exchanges: [
        {
          name: XRAY_DATA_EXCHANGE,
          type: 'direct',
        },
      ],
      uri: config.rmq.url,
    }),
  ],
  exports: [],
})
export class RabbitModule {}
