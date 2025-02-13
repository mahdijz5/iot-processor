import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  NonEmptyString,
  NonNegativeNumber,
  ObjectId,
  PositiveNumber,
} from 'src/common/types';
import { CreateSignal } from 'src/modules/signal/domain/create-signal';
import { Signal } from 'src/modules/signal/domain/signal';
import { UpdateSignal } from 'src/modules/signal/domain/update-signal';
import { SignalModel } from '../schemas/signal.schema';
import { SignalManagerInterface } from './signal.manager.interface';
import { ERROR } from 'src/common/enum';

@Injectable()
export class SignalManager implements SignalManagerInterface {
  constructor(
    @InjectModel(SignalModel.name) readonly model: Model<SignalModel>,
  ) {}

  async create(data: CreateSignal): Promise<Signal> {
    const model = new this.model({
      _id: new Types.ObjectId(),
      ...data,
    });
    await model.save();

    return Signal.mk({ ...model.toObject(), id: model._id.toString() });
  }

  async update(data: UpdateSignal): Promise<Signal> {
    const model = await this.model.findOneAndUpdate(
      {
        _id: new Types.ObjectId(data.id),
      },
      {
        ...data,
      },
      {
        lean: true,
      },
    );
    if (!model) throw new BadRequestException(ERROR.NOT_FOUND);

    return Signal.mk({ ...model, id: model._id.toString() });
  }

  async findOne(id: Signal.Id): Promise<Signal> {
    const model = await this.model.findOne(
      {
        _id: new Types.ObjectId(id),
      },
      {},
      { lean: true },
    );
    if (!model) throw new BadRequestException(ERROR.NOT_FOUND);

    return Signal.mk({ ...model, id: model._id.toString() });
  }

  async remove(id: Signal.Id): Promise<Signal> {
    const model = await this.model.findOneAndDelete(
      {
        _id: new Types.ObjectId(id),
      },
      { lean: true },
    );
    if (!model) throw new BadRequestException(ERROR.NOT_FOUND);
    return Signal.mk({ ...model, id: model._id.toString() });
  }

  async pagination(
    filter: {
      id?: ObjectId;
      deviceId?: NonEmptyString;
      dataLength?: PositiveNumber;
      dataVolume?: PositiveNumber;
    },
    page: PositiveNumber,
    limit: PositiveNumber,
  ): Promise<[Signal[], NonNegativeNumber]> {
    const query: any = [
      { $match: { deletedAt: null, ...filter } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ];

    const document = await this.model.aggregate([
      {
        $facet: {
          result: query,
          count: [{ $match: filter }, { $count: 'count' }],
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
