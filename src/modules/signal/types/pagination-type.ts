import { NonEmptyString, ObjectId, PositiveNumber } from 'src/common/types';

export type SignalPaginationType = {
  filter: {
    deviceId?: NonEmptyString;
    dataLength?: PositiveNumber;
    dataVolume?: PositiveNumber;
  };
  page: PositiveNumber;
  limit: PositiveNumber;
};
