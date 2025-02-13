import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  NonEmptyString,
  NonNegativeNumber,
  ObjectId,
  PositiveNumber,
  Timestamp,
  ValidNumber,
} from 'src/common/types';
import { z } from 'zod';

class XrayData {
  @ApiProperty({
    example: 8,
  })
  time: number;
  @ApiProperty({
    example: 8,
  })
  speed: number;
  @ApiProperty({
    example: 8,
  })
  x: number;
  @ApiProperty({
    example: 8,
  })
  y: number;
}

export class UpdateSignalDto {
  @ApiPropertyOptional({
    example: '67ad08a68e0e4b9cd2facd81',
  })
  deviceId?: string;
  @ApiPropertyOptional({
    example: 1739393200011,
  })
  time?: number;

  @ApiPropertyOptional({
    example: 2,
  })
  dataLength?: number;
  @ApiPropertyOptional({
    example: 8,
  })
  dataVolume?: number;
  @ApiPropertyOptional({
    type: () => [XrayData],
  })
  data?: Array<XrayData>;
}

export const XrayDataSchema = z.object({
  time: z.number().refine(PositiveNumber.is),
  speed: z.number().refine(NonNegativeNumber.is),
  x: z.number().refine(ValidNumber.is),
  y: z.number().refine(ValidNumber.is),
});

export const UpdateSignalDtoSchema = z.object({
  id: z.string().refine(ObjectId.is).optional(),
  deviceId: z.string().refine(NonEmptyString.is).optional(),
  time: z.number().refine(Timestamp.is).optional(),

  data: z.array(XrayDataSchema).optional(),
});
