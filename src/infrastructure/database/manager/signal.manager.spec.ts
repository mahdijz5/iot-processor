import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SignalModel } from '../schemas/signal.schema';
import { CreateSignal } from 'src/modules/signal/domain/create-signal';
import { UpdateSignal } from 'src/modules/signal/domain/update-signal';
import { Signal } from 'src/modules/signal/domain/signal';
import { BadRequestException } from '@nestjs/common';
import { ERROR } from 'src/common/enum';
import { SignalManager } from './signal.manager';

class SignalModelMock {
  _id: Types.ObjectId;
  name: string;

  constructor(data: Partial<SignalModel>) {
    this._id = new Types.ObjectId();
    Object.assign(this, data);
  }

  async save() {
    return this;
  }

  toObject() {
    return { ...this, id: this._id.toString() };
  }

  static findOneAndUpdate = jest.fn();
  static findOne = jest.fn();
  static findOneAndDelete = jest.fn();
  static aggregate = jest.fn();
}

describe('SignalManager', () => {
  let signalManager: SignalManager;
  let model: Model<SignalModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignalManager,
        { provide: getModelToken(SignalModel.name), useValue: SignalModelMock },
      ],
    }).compile();

    signalManager = module.get<SignalManager>(SignalManager);
    model = module.get<Model<SignalModel>>(getModelToken(SignalModel.name));

    jest.spyOn(Signal, 'mk').mockImplementation((input) => ({}) as any);
  });

  it('should create a signal', async () => {
    const createData = { deviceId: 'deviceId123' } as any;

    jest.spyOn(Signal, 'mk').mockImplementation((data) => data as any);

    const result = await signalManager.create(createData);

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.deviceId).toBe('deviceId123');
  });

  it('should update a signal', async () => {
    const mockId = new Types.ObjectId().toString();
    const mockUpdateData: UpdateSignal = {
      id: mockId,
      deviceId: '12345',
    } as any;

    const mockUpdatedSignal = {
      _id: new Types.ObjectId(mockId),
      ...mockUpdateData,
    };
    SignalModelMock.findOneAndUpdate.mockResolvedValue(mockUpdatedSignal);

    const result = await signalManager.update(mockUpdateData);

    expect(result).toEqual(
      Signal.mk({
        ...mockUpdatedSignal,
        id: mockUpdatedSignal._id.toString(),
      } as any),
    );
    expect(SignalModelMock.findOneAndUpdate).toHaveBeenCalled();
  });

  it('should throw an error if updating a non-existent signal', async () => {
    const mockId = new Types.ObjectId().toString();
    SignalModelMock.findOneAndUpdate.mockResolvedValue(null);

    await expect(
      signalManager.update({ id: mockId, deviceId: '12345' } as any),
    ).rejects.toThrow(new BadRequestException(ERROR.NOT_FOUND));
  });

  it('should find a signal by ID', async () => {
    const mockId = new Types.ObjectId().toString() as any;
    const mockSignal = {
      _id: new Types.ObjectId(mockId),
      deviceId: '12345',
    } as any;

    SignalModelMock.findOne.mockResolvedValue(mockSignal);

    const result = await signalManager.findOne(mockId);

    expect(result).toEqual(
      Signal.mk({ ...mockSignal, id: mockSignal._id.toString() } as any),
    );
    expect(SignalModelMock.findOne).toHaveBeenCalledWith(
      { _id: new Types.ObjectId(mockId) },
      {},
      { lean: true },
    );
  });

  it('should throw an error if signal is not found', async () => {
    const mockId = new Types.ObjectId().toString() as any;
    SignalModelMock.findOne.mockResolvedValue(null);

    await expect(signalManager.findOne(mockId)).rejects.toThrow(
      new BadRequestException(ERROR.NOT_FOUND),
    );
  });

  it('should delete a signal', async () => {
    const mockId = new Types.ObjectId().toString();
    const mockSignal = { _id: new Types.ObjectId(mockId), deviceId: '12345' };

    SignalModelMock.findOneAndDelete.mockResolvedValue(mockSignal);

    const result = await signalManager.remove(mockId as any);

    expect(result).toEqual(
      Signal.mk({ ...mockSignal, id: mockSignal._id.toString() } as any),
    );
    expect(SignalModelMock.findOneAndDelete).toHaveBeenCalledWith(
      { _id: new Types.ObjectId(mockId) },
      { lean: true },
    );
  });

  it('should throw an error if deleting a non-existent signal', async () => {
    const mockId = new Types.ObjectId().toString();
    SignalModelMock.findOneAndDelete.mockResolvedValue(null);

    await expect(signalManager.remove(mockId as any)).rejects.toThrow(
      new BadRequestException(ERROR.NOT_FOUND),
    );
  });

  it('should paginate signals', async () => {
    const mockPaginationFilter = { deviceId: '12345' } as any;
    const mockPage = 1 as any;
    const mockLimit = 10 as any;
    const mockSignal = { _id: new Types.ObjectId(), deviceId: '12345' };
    const mockCount = [{ count: 1 }];

    SignalModelMock.aggregate.mockResolvedValue([
      { result: [mockSignal], count: mockCount },
    ]);

    const result = await signalManager.pagination(
      mockPaginationFilter,
      mockPage,
      mockLimit,
    );

    expect(result).toEqual([
      [Signal.mk({ ...mockSignal, id: mockSignal._id.toString() } as any)],
      1,
    ]);
    expect(SignalModelMock.aggregate).toHaveBeenCalled();
  });

  it('should return empty result if no signals are found', async () => {
    const mockPaginationFilter = { deviceId: '12345' } as any;
    const mockPage = 1 as any;
    const mockLimit = 10 as any;

    SignalModelMock.aggregate.mockResolvedValue([{ result: [], count: [] }]);

    const result = await signalManager.pagination(
      mockPaginationFilter,
      mockPage,
      mockLimit,
    );

    expect(result).toEqual([[], 0]);
  });
});
