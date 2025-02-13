import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiCustomOkResponse } from 'src/common/decorator/api-ok-response.decorator';
import { z } from 'zod';

import { SignalService } from '../service/signal.service';
import { SignalResDto } from 'src/common/dto';
import {
  UpdateSignalDto,
  UpdateSignalDtoSchema,
  XrayDataSchema,
} from './dto/update-signal.dto';
import { ObjectId } from 'src/common/types';
import { IdSignalDtoSchema } from './dto/id-signal.dto';
import { SignalPaginationDto, SignalPaginationSchema } from './dto';

@ApiTags('Signal')
@Controller({ path: 'signal', version: '1' })
export class SignalController {
  constructor(private readonly signalService: SignalService) {}

  @ApiCustomOkResponse(SignalResDto)
  @ApiOperation({ summary: 'Update Signal.' })
  @HttpCode(HttpStatus.OK)
  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() data: UpdateSignalDto) {
    try {
      const validatedData = UpdateSignalDtoSchema.parse({ ...data, id });

      return this.signalService.update(validatedData.id, {
        ...validatedData,
        data: validatedData.data as Required<z.infer<typeof XrayDataSchema>>[],
      });
    } catch (error) {
      throw error;
    }
  }

  @ApiCustomOkResponse(SignalResDto)
  @ApiOperation({ summary: 'Remove Signal.' })
  @HttpCode(HttpStatus.OK)
  @Delete('remove/:id')
  async remove(@Param('id') id: string) {
    try {
      const validatedData = IdSignalDtoSchema.parse({ id }) as Required<
        z.infer<typeof IdSignalDtoSchema>
      >;

      return this.signalService.remove(validatedData.id);
    } catch (error) {
      throw error;
    }
  }

  @ApiCustomOkResponse(SignalResDto)
  @ApiOperation({ summary: 'FindOne Signal.' })
  @HttpCode(HttpStatus.OK)
  @Get('findOne/:id')
  async findOne(@Param('id') id: string) {
    try {
      const validatedData = IdSignalDtoSchema.parse({ id }) as Required<
        z.infer<typeof IdSignalDtoSchema>
      >;

      return this.signalService.findOne(validatedData.id);
    } catch (error) {
      throw error;
    }
  }

  @ApiCustomOkResponse(SignalResDto)
  @ApiOperation({ summary: 'Pagination signal.' })
  @HttpCode(HttpStatus.OK)
  @Post('pagination')
  async pagination(@Body() data: SignalPaginationDto) {
    try {
      const validatedData = SignalPaginationSchema.parse(data) as Required<
        z.infer<typeof SignalPaginationSchema>
      >;

      return this.signalService.pagination(validatedData);
    } catch (error) {
      throw error;
    }
  }
}
