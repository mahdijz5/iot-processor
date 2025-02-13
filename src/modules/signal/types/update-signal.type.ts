import {
  NonEmptyString,
  NonNegativeNumber,
  PositiveNumber,
  Timestamp,
  ValidNumber,
} from 'src/common/types';

type Xray = {
  time: PositiveNumber;
  speed: NonNegativeNumber;
  x: ValidNumber;
  y: ValidNumber;
};

export type UpdateSignalType = {
  deviceId?: NonEmptyString;
  time?: Timestamp;
  data?: Array<Xray>;
};
