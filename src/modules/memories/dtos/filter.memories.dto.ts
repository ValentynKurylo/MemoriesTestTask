import {
  IsOptional,
  IsArray,
  IsString,
  IsEnum,
  IsDateString,
  IsInt,
  Min,
  IsIn,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { AggregateMemoriesTypeEnum, EmotionEnum } from '../../../common/enums';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterMemoriesDto {
  @ApiPropertyOptional({
    description: 'Filter by tags. Accepts one or multiple tags.',
    example: ['travel', 'summer'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Start date for filtering (ISO 8601 format)',
    example: '2024-01-01T00:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({
    description: 'End date for filtering (ISO 8601 format)',
    example: '2024-12-31T23:59:59.999Z',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  to?: string;

  @ApiPropertyOptional({
    description: 'Filter by emotion',
    enum: EmotionEnum,
    example: EmotionEnum.JOY,
  })
  @IsOptional()
  @IsEnum(EmotionEnum)
  emotion?: EmotionEnum;

  @ApiPropertyOptional({
    description: 'Page number for pagination (default: 1)',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page (default: 10)',
    example: 10,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Aggregate memories by time unit',
    enum: AggregateMemoriesTypeEnum,
    example: AggregateMemoriesTypeEnum.MONTH,
  })
  @IsOptional()
  @IsIn(Object.values(AggregateMemoriesTypeEnum))
  aggregateBy?: AggregateMemoriesTypeEnum;
}
