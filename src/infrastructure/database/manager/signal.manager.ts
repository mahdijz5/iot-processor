import { match, Option } from 'fp-ts/lib/Option';
import { Model, Types } from 'mongoose';
import {
  NonEmptyString,
  NonNegativeNumber,
  PositiveNumber,
} from 'src/common/types';
import { CreateSignal } from 'src/modules/signal/domain/create-signal';
import { Signal } from 'src/modules/signal/domain/signal';
import { SignalModel } from '../schemas/signal.schema';
import { SignalManagerInterface } from './signal.manager.interface';

export abstract class SignalManager implements SignalManagerInterface {
  constructor(protected readonly model: Model<SignalModel>) {}

  async create(data: CreateSignal): Promise<Signal> {
    const model = new this.model({
      _id: new Types.ObjectId(),
      ...data,
    });
    await model.save();

    return Signal.mk({ ...model.toObject(), id: model._id.toString() });
  }

  async update(id: Signal.Id, data: Signal): Promise<Signal> {
    const model = await this.model.findOneAndUpdate(
      {
        id: new Types.ObjectId(id),
      },
      {
        ...data,
      },
      {
        lean: true,
      },
    );

    return Signal.mk({ ...model, id: model._id.toString() });
  }

  async findOne(id: Signal.Id): Promise<Signal> {
    const model = await this.model.findOne(
      {
        id: new Types.ObjectId(id),
      },
      {},
      { lean: true },
    );

    return Signal.mk({ ...model, id: model._id.toString() });
  }

  async remove(id: Signal.Id): Promise<Signal> {
    const model = await this.model.findOneAndDelete(
      {
        id: new Types.ObjectId(id),
      },
      { lean: true },
    );

    return Signal.mk({ ...model, id: model._id.toString() });
  }

  async pagination(
    filter: {
      id: Option<Signal.Id>;
      deviceId: Option<NonEmptyString>;
      dataLength: Option<Signal.DataLength>;
      dataVolume: Option<Signal.DataVolume>;
    },
    page: PositiveNumber,
    limit: PositiveNumber,
  ): Promise<[Signal[], NonNegativeNumber]> {
    const filterObj = Object.fromEntries(
      Object.entries(filter).map(([key, value]) => [
        key,
        match(
          () => null,
          (val) => val,
        )(value as Option<unknown>),
      ]),
    );
    const query: any = [
      { $match: { deletedAt: null, ...filterObj } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ];

    const document = await this.model.aggregate([
      {
        $facet: {
          result: query,
          count: [{ $match: filterObj }, { $count: 'count' }],
        },
      },
    ]);
    const result = document[0].result as Array<SignalModel>;

    return [
      result.reduce(
        (acc, curr) => [
          ...acc,
          Signal.mk({ ...curr, id: curr._id.toString() }),
        ],
        [],
      ),
      NonNegativeNumber.mkUnsafe(
        document[0].count[0] ? Number(document[0].count[0].count) : 0,
      ),
    ];
  }
}
