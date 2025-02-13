import { ApiProperty } from '@nestjs/swagger';

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

export class SignalResDto {
  @ApiProperty({
    example: '67ad08a68e0e4b9cd2facd81',
  })
  deviceId: string;
  @ApiProperty({
    example: 1739393200011,
  })
  time: number;

  @ApiProperty({
    example: 2,
  })
  dataLength: number;
  @ApiProperty({
    example: 8,
  })
  dataVolume: number;
  @ApiProperty({
    type: () => [XrayData],
  })
  data: Array<XrayData>;
}
