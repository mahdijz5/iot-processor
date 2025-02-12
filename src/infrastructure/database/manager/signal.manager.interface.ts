import {
  NonEmptyString,
  NonNegativeNumber,
  ObjectId,
  PositiveNumber,
} from 'src/common/types';
import { CreateSignal } from 'src/modules/signal/domain/create-signal';
import { Signal } from 'src/modules/signal/domain/signal';
import { UpdateSignal } from 'src/modules/signal/domain/update-signal';

type SignalFilter = {
  id?: ObjectId;
  deviceId?: NonEmptyString;
  dataLength?: PositiveNumber;
  dataVolume?: PositiveNumber;
};

export interface SignalManagerInterface {
  create(data: CreateSignal): Promise<Signal>;
  update(data: UpdateSignal): Promise<Signal>;
  remove(id: Signal.Id): Promise<Signal>;
  findOne(id: Signal.Id): Promise<Signal>;
  pagination(
    filter: SignalFilter,
    page: PositiveNumber,
    limit: PositiveNumber,
  ): Promise<[Signal[], NonNegativeNumber]>;
}
