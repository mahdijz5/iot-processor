import { z } from 'zod';

export type SignalConsumedDataType = SignalConsumedDataType.SignalResponse;
export namespace SignalConsumedDataType {
  type DeviceId = string;

  type Coordinate = [number, number, number];

  type SignalEntry = [number, Coordinate];

  interface SignalData {
    data: SignalEntry[];
    time: number;
  }

  export type SignalResponse = Record<DeviceId, SignalData>;

  const CoordinateSchema = z.tuple([
    z.number(),
    z.number(),
    z.number().nonnegative(),
  ]);

  const SignalEntrySchema = z.tuple([
    z.number().int().nonnegative(),
    CoordinateSchema,
  ]);

  const SignalDataSchema = z.object({
    data: z.array(SignalEntrySchema),
    time: z.number().int().nonnegative(),
  });

  export const schema = z.record(z.string().length(24), SignalDataSchema);
}
