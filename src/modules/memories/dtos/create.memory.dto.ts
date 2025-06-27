import {
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EmotionEnum } from '../../../common/enums';

export class CreateMemoryDto {
  @ApiProperty({
    example: 'Trip to Lviv',
    description: 'The title of the memory',
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    example: 'It was a warm and sunny day...',
    description: 'Optional description of the memory',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: ['travel', 'summer'],
    description: 'Optional tags related to the memory',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    example: EmotionEnum.JOY,
    enum: EmotionEnum,
    description: 'The dominant emotion associated with the memory',
  })
  @IsEnum(EmotionEnum)
  emotion: EmotionEnum;

  @ApiProperty({
    example: '2024-07-14T12:00:00.000Z',
    description: 'ISO 8601 date and time of the memory',
    type: String,
    format: 'date-time',
  })
  @IsDateString()
  date: string;
}
