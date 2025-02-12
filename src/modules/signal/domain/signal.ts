import { none, Option, some } from 'fp-ts/Option';
import { Brand, NonEmptyString, ObjectId, Timestamp } from 'src/common/types';
import { z } from 'zod';
import { Xray } from './xray';

export type Signal = Signal.Base;
export namespace Signal {
  export type Base = {
    id: Id;
    deviceId: NonEmptyString;
    time: Timestamp;
    dataLength: DataLength;
    dataVolume: DataVolume;
    data: Array<Xray>;
  };

  export type Id = Id.Type;
  export namespace Id {
    export type Type = Brand<string, 'signalId'>;
    export const is = (value: string): value is Id => ObjectId.is(value);
    export const mk = (value: string): Option<Id> =>
      is(value) ? some(value) : none;
    export const mkUnsafe = (value: string) => {
      if (!is(value)) throw new Error('Invalid Id');
      return value;
    };
  }

  export type DataLength = DataLength.Type;
  export namespace DataLength {
    export type Type = Brand<number, 'DataLength'>;
    export const is = (value: number): value is DataLength =>
      typeof value === 'number' && value >= 0;
    export const mk = (value: number): Option<DataLength> =>
      is(value) ? some(value) : none;
    export const mkUnsafe = (value: number) => {
      if (!is(value)) throw new Error('Invalid DataLength');
      return value;
    };
  }

  export type DataVolume = DataVolume.Type;
  export namespace DataVolume {
    export type Type = Brand<number, 'DataVolume'>;
    export const is = (value: number): value is DataVolume =>
      typeof value === 'number' && value >= 0;
    export const mk = (value: number): Option<DataVolume> =>
      is(value) ? some(value) : none;
    export const mkUnsafe = (value: number) => {
      if (!is(value)) throw new Error('Invalid DataLength');
      return value;
    };
  }

  const signalSchema = z
    .object({
      id: z.string().refine(Id.is, { message: 'Invalid time' }),
      deviceId: z
        .string()
        .refine(NonEmptyString.is, { message: 'Invalid deviceId' }),
      time: z.number().refine(Timestamp.is, { message: 'Invalid timestamp' }),
    })
    .required();

  export const mk = (value: {
    id: string;
    deviceId: string;
    time: number;
    data: Array<{
      time: number;
      speed: number;
      x: number;
      y: number;
    }>;
  }): Signal => {
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
      dataVolume: DataVolume.mkUnsafe(dataVolume),
      dataLength: DataLength.mkUnsafe(dataLength),
      data,
    };
  };
}
