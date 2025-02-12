import { Inject, Injectable } from '@nestjs/common';
import { InjectTokenEnum } from 'src/common/enum';
import { SignalManagerInterface } from 'src/infrastructure/database/manager/signal.manager.interface';
import { SignalConsumedDataType } from '../types/signal-data.type';
import { CreateSignal } from '../domain/create-signal';

@Injectable()
export class SignalTransformService {
  constructor(
    @Inject(InjectTokenEnum.SIGNAL_MANAGER)
    private readonly signalManager: SignalManagerInterface,
  ) {}

  async dataProcessor(signalResponse: SignalConsumedDataType) {
    try {
      const converted = Object.keys(signalResponse).reduce(
        (acc: CreateSignal.MkInput[], deviceId) => {
          const record = signalResponse[deviceId];

          const transformedData = record.data.reduce(
            (
              innerAcc: Array<{
                time: number;
                x: number;
                y: number;
                speed: number;
              }>,
              entry,
            ) => {
              const [entryTime, coordinates] = entry;
              const [x, y, speed] = coordinates;
              innerAcc.push({ time: entryTime, x, y, speed });
              return innerAcc;
            },
            [],
          );

          acc.push({
            deviceId,
            time: record.time,
            data: transformedData,
          });

          return acc;
        },
        [],
      );

      const tasks = converted.reduce(
        (acc, curr) => [
          ...acc,
          this.signalManager.create(CreateSignal.mk(curr)),
        ],
        [],
      );

      await Promise.allSettled(tasks);
    } catch (error) {
      console.log(error);
    }
  }
}
