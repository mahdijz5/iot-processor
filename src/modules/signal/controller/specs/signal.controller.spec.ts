import { Test, TestingModule } from '@nestjs/testing';

import { z } from 'zod';
import { SignalController } from '../signal.controller';
import { SignalService } from '../../service/signal.service';
import {
  IdSignalDtoSchema,
  SignalPaginationDto,
  SignalPaginationSchema,
  UpdateSignalDto,
  UpdateSignalDtoSchema,
} from '../dto';

const mockSignalService = {
  update: jest.fn(),
  remove: jest.fn(),
  findOne: jest.fn(),
  pagination: jest.fn(),
};

describe('SignalController', () => {
  let controller: SignalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignalController],
      providers: [{ provide: SignalService, useValue: mockSignalService }],
    }).compile();

    controller = module.get<SignalController>(SignalController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update a signal', async () => {
    const mockId = '65a1234bcdef567890123456';
    const mockUpdateData: UpdateSignalDto = {
      data: [{ time: 1700000000, x: 10, y: 20, speed: 5 }],
    };
    const mockUpdatedSignal = { id: mockId, ...mockUpdateData };

    jest
      .spyOn(UpdateSignalDtoSchema, 'parse')
      .mockReturnValue({ id: mockId, ...mockUpdateData } as any);
    (mockSignalService.update as jest.Mock).mockResolvedValue(
      mockUpdatedSignal,
    );

    const result = await controller.update(mockId, mockUpdateData);
    expect(result).toEqual(mockUpdatedSignal);
    expect(mockSignalService.update).toHaveBeenCalledWith(mockId, {
      id: mockId,
      ...mockUpdateData,
    });
  });

  it('should remove a signal', async () => {
    const mockId = '65a1234bcdef567890123456';
    (mockSignalService.remove as jest.Mock).mockResolvedValue(true);
    jest
      .spyOn(IdSignalDtoSchema, 'parse')
      .mockReturnValue({ id: mockId } as any);

    const result = await controller.remove(mockId);
    expect(result).toBe(true);
    expect(mockSignalService.remove).toHaveBeenCalledWith(mockId);
  });

  it('should find a signal by id', async () => {
    const mockId = '65a1234bcdef567890123456';
    const mockSignal = { id: mockId, data: 'test-data' };

    (mockSignalService.findOne as jest.Mock).mockResolvedValue(mockSignal);
    jest
      .spyOn(IdSignalDtoSchema, 'parse')
      .mockReturnValue({ id: mockId } as any);

    const result = await controller.findOne(mockId);
    expect(result).toEqual(mockSignal);
    expect(mockSignalService.findOne).toHaveBeenCalledWith(mockId);
  });

  it('should paginate signals', async () => {
    const mockPaginationInput: SignalPaginationDto = {
      filter: {},
      page: 1,
      limit: 10,
    };
    const mockPaginatedResponse = {
      items: [],
      meta: { page: 1, limit: 10, total: 0 },
    };

    (mockSignalService.pagination as jest.Mock).mockResolvedValue(
      mockPaginatedResponse,
    );
    jest
      .spyOn(SignalPaginationSchema, 'parse')
      .mockReturnValue(mockPaginationInput as any);

    const result = await controller.pagination(mockPaginationInput);
    expect(result).toEqual(mockPaginatedResponse);
    expect(mockSignalService.pagination).toHaveBeenCalledWith(
      mockPaginationInput,
    );
  });

  it('should throw an error if update validation fails', async () => {
    const mockId = 'invalid-id';
    const mockUpdateData: UpdateSignalDto = {
      data: [{ time: 1700000000, x: 10, y: 20, speed: 5 }],
    };

    jest.spyOn(UpdateSignalDtoSchema, 'parse').mockImplementation(() => {
      throw new Error('Validation Error');
    });

    await expect(controller.update(mockId, mockUpdateData)).rejects.toThrow(
      'Validation Error',
    );
  });

  it('should throw an error if remove validation fails', async () => {
    const mockId = 'invalid-id';

    jest.spyOn(IdSignalDtoSchema, 'parse').mockImplementation(() => {
      throw new Error('Validation Error');
    });

    await expect(controller.remove(mockId)).rejects.toThrow('Validation Error');
  });

  it('should throw an error if findOne validation fails', async () => {
    const mockId = 'invalid-id';

    jest.spyOn(IdSignalDtoSchema, 'parse').mockImplementation(() => {
      throw new Error('Validation Error');
    });

    await expect(controller.findOne(mockId)).rejects.toThrow(
      'Validation Error',
    );
  });

  it('should throw an error if pagination validation fails', async () => {
    const mockPaginationInput: SignalPaginationDto = {
      filter: {},
      page: -1,
      limit: 10,
    };

    jest.spyOn(SignalPaginationSchema, 'parse').mockImplementation(() => {
      throw new Error('Validation Error');
    });

    await expect(controller.pagination(mockPaginationInput)).rejects.toThrow(
      'Validation Error',
    );
  });
});
