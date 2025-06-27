import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
export class PaginationResponseDto<T> {
  @ApiProperty({ isArray: true, description: 'Data items' })
  data: T[];

  @ApiProperty({ description: 'Total number of records' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  @Type(() => Number)
  page: number;

  @ApiProperty({ description: 'Number of records per page' })
  @Type(() => Number)
  limit: number;
}
