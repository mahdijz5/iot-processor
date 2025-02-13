import { Inject, Injectable } from '@nestjs/common';
import { InjectTokenEnum } from 'src/common/enum';
import { SignalManagerInterface } from 'src/infrastructure/database/manager/signal.manager.interface';
import { Signal } from '../domain/signal';
import { UpdateSignal } from '../domain/update-signal';
import { UpdateSignalType } from '../types/update-signal.type';
import { SignalPaginationType } from '../types';
import { PaginationResDto } from 'src/common/dto';
import { ObjectId } from 'src/common/types';

@Injectable()
export class SignalService {
  constructor(
    @Inject(InjectTokenEnum.SIGNAL_MANAGER)
    private readonly signalManager: SignalManagerInterface,
  ) {}

  async findOne(id: ObjectId) {
    try {
      return await this.signalManager.findOne(Signal.Id.mkUnsafe(id));
    } catch (error) {
      throw error;
    }
  }

  async remove(id: ObjectId) {
    try {
      return await this.signalManager.remove(Signal.Id.mkUnsafe(id));
    } catch (error) {
      throw error;
    }
  }

  async update(id: ObjectId, data: UpdateSignalType) {
    try {
      const updateSignal = UpdateSignal.mk({ id, ...data });
      return await this.signalManager.update(updateSignal);
    } catch (error) {
      throw error;
    }
  }

  async pagination(
    data: SignalPaginationType,
  ): Promise<PaginationResDto<Signal>> {
    try {
      const [offers, total] = await this.signalManager.pagination(
        data.filter,
        data.page,
        data.limit,
      );

      return new PaginationResDto(
        offers.reduce((p, c) => [...p, Signal.mk(c)], []),
        {
          limit: data.limit,
          page: data.page,
          total: total,
        },
      );
    } catch (error) {
      throw error;
    }
  }
}
