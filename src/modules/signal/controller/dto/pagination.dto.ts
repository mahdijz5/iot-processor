import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NonEmptyString, ObjectId, PositiveNumber } from 'src/common/types';
import { z } from 'zod';

class Filter {
  @ApiPropertyOptional({
    example: '67ad08a68e0e4b9cd2facd81',
  })
  deviceId?: string;

  @ApiPropertyOptional({
    example: 2,
  })
  dataLength?: number;
  @ApiPropertyOptional({
    example: 8,
  })
  dataVolume?: number;
}

export class SignalPaginationDto {
  @ApiProperty({ type: () => Filter })
  filter: Filter;

  @ApiPropertyOptional({
    type: Number,
    example: 1,
  })
  page: number;

  @ApiPropertyOptional({
    type: Number,
    example: 10,
  })
  limit: number;
}

const FilterSchema = z.object({
  deviceId: z.string().refine(NonEmptyString.is).optional(),
  dataLength: z.number().refine(PositiveNumber.is).optional(),
  dataVolume: z.number().refine(PositiveNumber.is).optional(),
});

export const SignalPaginationSchema = z.object({
  filter: FilterSchema,
  page: z.number().refine(PositiveNumber.is),
  limit: z.number().refine(PositiveNumber.is),
});
