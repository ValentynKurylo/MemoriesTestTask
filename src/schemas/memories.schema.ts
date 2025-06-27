import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EmotionEnum } from '../common/enums';

@Schema({ timestamps: true })
export class Memory extends Document {
  @ApiProperty({ description: 'Memory title', example: 'Trip to Lviv' })
  @Prop({ required: true })
  title: string;

  @ApiPropertyOptional({
    description: 'Optional description of the memory',
    example: 'It was a warm sunny day',
  })
  @Prop()
  description?: string;

  @ApiPropertyOptional({
    description: 'Tags associated with the memory',
    type: [String],
    example: ['travel', 'summer'],
  })
  @Prop({ type: [String], default: [] })
  tags?: string[];

  @ApiProperty({
    description: 'Emotion linked to the memory',
    enum: EmotionEnum,
    example: EmotionEnum.JOY,
  })
  @Prop({ enum: EmotionEnum, required: true })
  emotion: EmotionEnum;

  @ApiProperty({
    description: 'Date and time of the memory',
    type: String,
    format: 'date-time',
    example: '2024-07-14T12:00:00.000Z',
  })
  @Prop({ required: true })
  date: Date;
}

export const MemorySchema = SchemaFactory.createForClass(Memory);
