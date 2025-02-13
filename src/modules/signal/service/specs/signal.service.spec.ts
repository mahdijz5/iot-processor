import { Test, TestingModule } from '@nestjs/testing';
import { PaginationResDto } from 'src/common/dto';
import { InjectTokenEnum } from 'src/common/enum';
import { SignalManagerInterface } from 'src/infrastructure/database/manager/signal.manager.interface';
import { Signal } from '../../domain/signal';
import { UpdateSignal } from '../../domain/update-signal';
import { SignalPaginationType, UpdateSignalType } from '../../types';
import { SignalService } from '../signal.service';

const mockSignalManager: SignalManagerInterface = {
  findOne: jest.fn(),
  remove: jest.fn(),
  update: jest.fn(),
  pagination: jest.fn(),
  create: jest.fn(),
};

describe('SignalService', () => {
  let service: SignalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignalService,
        {
          provide: InjectTokenEnum.SIGNAL_MANAGER,
          useValue: mockSignalManager,
        },
      ],
    }).compile();

    service = module.get<SignalService>(SignalService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find a signal by id', async () => {
    const mockId = '65a1234bcdef567890123456';
    const mockSignal = { id: mockId, data: 'test-data' };

    (mockSignalManager.findOne as jest.Mock).mockResolvedValue(mockSignal);
    jest.spyOn(Signal.Id, 'mkUnsafe').mockReturnValue(mockId as any);

    const result = await service.findOne(mockId as any);
    expect(result).toEqual(mockSignal);
    expect(mockSignalManager.findOne).toHaveBeenCalledWith(mockId);
  });

  it('should remove a signal by id', async () => {
    const mockId = '65a1234bcdef567890123456';

    (mockSignalManager.remove as jest.Mock).mockResolvedValue(true);
    jest.spyOn(Signal.Id, 'mkUnsafe').mockReturnValue(mockId as any);

    const result = await service.remove(mockId as any);
    expect(result).toBe(true);
    expect(mockSignalManager.remove).toHaveBeenCalledWith(mockId);
  });

  it('should update a signal', async () => {
    const mockId = '65a1234bcdef567890123456';
    const mockUpdateData: UpdateSignalType = {
      deviceId: 'deviceId 123' as any,
    };
    const mockUpdatedSignal = { id: mockId, ...mockUpdateData };

    jest.spyOn(UpdateSignal, 'mk').mockReturnValue(mockUpdatedSignal as any);
    (mockSignalManager.update as jest.Mock).mockResolvedValue(
      mockUpdatedSignal,
    );

    const result = await service.update(mockId as any, mockUpdateData);
    expect(result).toEqual(mockUpdatedSignal);
    expect(UpdateSignal.mk).toHaveBeenCalledWith({
      id: mockId,
      ...mockUpdateData,
    });
    expect(mockSignalManager.update).toHaveBeenCalledWith(mockUpdatedSignal);
  });

  it('should paginate signals', async () => {
    const mockPaginationInput: SignalPaginationType = {
      filter: {},
      page: 1 as any,
      limit: 10 as any,
    };
    const mockSignal = { id: 'signal123', data: 'mock-data' } as any;
    const mockResponse = [[mockSignal], 1];

    (mockSignalManager.pagination as jest.Mock).mockResolvedValue(mockResponse);
    jest.spyOn(Signal, 'mk').mockReturnValue(mockSignal);

    const result = await service.pagination(mockPaginationInput);

    expect(result).toEqual(
      new PaginationResDto([mockSignal], {
        limit: 10 as any,
        page: 1 as any,
        total: 1 as any,
      }),
    );
    expect(mockSignalManager.pagination).toHaveBeenCalledWith({}, 1, 10);
  });

  it('should handle errors in findOne', async () => {
    const mockId = '65a1234bcdef567890123456' as any;
    (mockSignalManager.findOne as jest.Mock).mockRejectedValue(
      new Error('DB Error'),
    );

    await expect(service.findOne(mockId)).rejects.toThrow('DB Error');
  });

  it('should handle errors in remove', async () => {
    const mockId = '65a1234bcdef567890123456' as any;
    (mockSignalManager.remove as jest.Mock).mockRejectedValue(
      new Error('DB Error'),
    );

    await expect(service.remove(mockId)).rejects.toThrow('DB Error');
  });

  it('should handle errors in update', async () => {
    const mockId = '65a1234bcdef567890123456' as any;
    const mockUpdateData: UpdateSignalType = { data: 'updated-data' as any };
    (mockSignalManager.update as jest.Mock).mockRejectedValue(
      new Error('DB Error'),
    );

    await expect(service.update(mockId, mockUpdateData)).rejects.toThrow(
      'DB Error',
    );
  });

  it('should handle errors in pagination', async () => {
    const mockPaginationInput: SignalPaginationType = {
      filter: {},
      page: 1 as any,
      limit: 10 as any,
    };
    (mockSignalManager.pagination as jest.Mock).mockRejectedValue(
      new Error('DB Error'),
    );

    await expect(service.pagination(mockPaginationInput)).rejects.toThrow(
      'DB Error',
    );
  });
});
