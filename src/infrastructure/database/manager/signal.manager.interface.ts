import { Option } from 'fp-ts/lib/Option';
import {
  NonEmptyString,
  NonNegativeNumber,
  PositiveNumber,
} from 'src/common/types';
import { CreateSignal } from 'src/modules/signal/domain/create-signal';
import { Signal } from 'src/modules/signal/domain/signal';

type SignalFilter = {
  id: Option<Signal.Id>;
  deviceId: Option<NonEmptyString>;
  dataLength: Option<Signal.DataLength>;
  dataVolume: Option<Signal.DataVolume>;
};

export interface SignalManagerInterface {
  create(data: CreateSignal): Promise<Signal>;
  update(id: Signal.Id, data: Signal): Promise<Signal>;
  remove(id: Signal.Id): Promise<Signal>;
  findOne(id: Signal.Id): Promise<Signal>;
  pagination(
    filter: SignalFilter,
    page: PositiveNumber,
    limit: PositiveNumber,
  ): Promise<[Signal[], NonNegativeNumber]>;
}
