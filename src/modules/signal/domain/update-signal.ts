import { NonEmptyString, Timestamp } from 'src/common/types';
import { z } from 'zod';
import { Signal } from './signal';
import { Xray } from './xray';

export type UpdateSignal = UpdateSignal.Base;
export namespace UpdateSignal {
  export type Base = {
    id: Signal.Id;
    deviceId?: NonEmptyString;
    time?: Timestamp;
    dataLength?: Signal.DataLength;
    dataVolume?: Signal.DataVolume;
    data?: Array<Xray>;
  };

  const signalSchema = z.object({
    deviceId: z
      .string()
      .refine(NonEmptyString.is, { message: 'Invalid deviceId' })
      .optional(),
    time: z
      .number()
      .refine(Timestamp.is, { message: 'Invalid timestamp' })
      .optional(),
  });

  export type MkInput = {
    id: string;
    deviceId?: string;
    time?: number;
    data?: Array<{
      time: number;
      speed: number;
      x: number;
      y: number;
    }>;
  };

  export const mk = (value: MkInput): UpdateSignal => {
    const validateData = signalSchema.parse(value);
    const id = Signal.Id.mkUnsafe(value.id);

    let result: UpdateSignal = { ...validateData, id };
    if (value.data) {
      const dataLength = value.data.length;
      let dataVolume = 0;
      const data: Xray[] = value.data.reduce((acc, curr) => {
        dataVolume += Object.keys(curr).length;
        return [...acc, Xray.mk(curr)];
      }, []);

      result = {
        ...result,
        data,
        dataVolume: Signal.DataVolume.mk(dataVolume),
        dataLength: Signal.DataLength.mk(dataLength),
      };
    }

    return result;
  };
}
