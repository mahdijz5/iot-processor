import { Injectable } from '@nestjs/common';
 import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';
import { config } from 'src/config';

@Injectable()
export class RmqService {
 
    getOptions(queue: string, noAck = true): RmqOptions {
        return {
            transport: Transport.RMQ,
            options: {
                urls: [config.rmq.url],
                queue,
                noAck,
                persistent: true,
                queueOptions: {
                    durable: false,
                },
                socketOptions: {
                    connectionOptions: {
                        keepAlive: true,
                        timeout: 240000,
                    },
                },
            },
        };
    }

    ack(context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMessage = context.getMessage();
        channel.ack(originalMessage);
    }
}
