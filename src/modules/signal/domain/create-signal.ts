import { NonEmptyString, Timestamp } from 'src/common/types';
import { z } from 'zod';
import { Signal } from './signal';
import { Xray } from './xray';

export type CreateSignal = CreateSignal.Base;
export namespace CreateSignal {
  export type Base = {
    deviceId: NonEmptyString;
    time: Timestamp;
    dataLength: Signal.DataLength;
    dataVolume: Signal.DataVolume;
    data: Array<Xray>;
  };

  const signalSchema = z
    .object({
      deviceId: z
        .string()
        .refine(NonEmptyString.is, { message: 'Invalid deviceId' }),
      time: z.number().refine(Timestamp.is, { message: 'Invalid timestamp' }),
    })
    .required();

  export const mk = (value: {
    deviceId: string;
    time: number;
    data: Array<{
      time: number;
      speed: number;
      x: number;
      y: number;
    }>;
  }): CreateSignal => {
    const validateData = signalSchema.parse(value) as Required<
      z.infer<typeof signalSchema>
    >;
    const dataLength = value.data.length;
    let dataVolume = 0;

    const data: Xray[] = value.data.reduce((acc, curr) => {
      dataVolume += curr[1].length;
      return [...acc, Xray.mk(curr)];
    }, []);

    return {
      ...validateData,
      dataVolume: Signal.DataVolume.mkUnsafe(dataVolume),
      dataLength: Signal.DataLength.mkUnsafe(dataLength),
      data,
    };
  };
}
