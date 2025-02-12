import { NonEmptyString, ObjectId, PositiveNumber } from 'src/common/types';

export type SignalPaginationType = {
  filter: {
    id?: ObjectId;
    deviceId?: NonEmptyString;
    dataLength?: PositiveNumber;
    dataVolume?: PositiveNumber;
  };
  page: PositiveNumber;
  limit: PositiveNumber;
};
