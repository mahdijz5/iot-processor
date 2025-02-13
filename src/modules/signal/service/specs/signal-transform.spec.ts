import { Test, TestingModule } from '@nestjs/testing';
import { InjectTokenEnum } from 'src/common/enum';
import { SignalManagerInterface } from 'src/infrastructure/database/manager/signal.manager.interface';
import { SignalTransformService } from '../signal-transform.service';
import { SignalConsumedDataType } from '../../types';
import { CreateSignal } from '../../domain/create-signal';

const mockSignalManager: SignalManagerInterface = {
  create: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
  pagination: jest.fn(),
  update: jest.fn(),
};

describe('SignalTransformService', () => {
  let service: SignalTransformService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignalTransformService,
        {
          provide: InjectTokenEnum.SIGNAL_MANAGER,
          useValue: mockSignalManager,
        },
      ],
    }).compile();

    service = module.get<SignalTransformService>(SignalTransformService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should process valid signal data correctly', async () => {
    const signalResponse: SignalConsumedDataType = {
      device123: {
        time: 1700000000,
        data: [
          [1700000000, [12.34, 56.78, 9.87]],
          [1700000010, [22.34, 66.78, 19.87]],
        ],
      },
    };

    const expectedTransformed = {
      deviceId: 'device123',
      time: 1700000000,
      data: [
        { time: 1700000000, x: 12.34, y: 56.78, speed: 9.87 },
        { time: 1700000010, x: 22.34, y: 66.78, speed: 19.87 },
      ],
    };

    (mockSignalManager.create as jest.Mock).mockResolvedValue(undefined);
    jest.spyOn(CreateSignal, 'mk').mockImplementation((input) => ({}) as any);

    await service.dataProcessor(signalResponse);

    expect(CreateSignal.mk).toHaveBeenCalledWith(expectedTransformed);
    expect(mockSignalManager.create).toHaveBeenCalledTimes(1);
  });

  it('should handle an empty signalResponse without errors', async () => {
    const signalResponse: SignalConsumedDataType = {};

    await service.dataProcessor(signalResponse);

    expect(mockSignalManager.create).not.toHaveBeenCalled();
  });
});
