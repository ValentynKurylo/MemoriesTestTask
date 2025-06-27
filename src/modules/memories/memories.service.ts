import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PipelineStage, Types } from 'mongoose';
import { Memory } from '../../schemas';
import {
  CreateMemoryDto,
  FilterMemoriesDto,
  UpdateMemoryDto,
  AggregatedMemoriesResult,
} from './dtos';
import { PaginationResponseDto } from '../../common/dtos';
import { UA_MONTHS } from '../../common/consts';
import {
  formatDate,
  getStartDateOfISOWeek,
  getMemoriesFilters,
  getMemoriesAggregation,
} from '../../common/helpers';
import { AggregateMemoriesTypeEnum } from '../../common/enums';
import { formatAggregatedResult } from '../../common/helpers/format.aggregated.results.helper';

@Injectable()
export class MemoriesService {
  constructor(@InjectModel(Memory.name) private memoryModel: Model<Memory>) {}

  async create(dto: CreateMemoryDto): Promise<Memory> {
    return this.memoryModel.create(dto);
  }

  private async getPaginationMemories(
    filter: FilterMemoriesDto,
    match: FilterQuery<Memory>,
  ): Promise<PaginationResponseDto<Memory>> {
    const page = filter.page || 1;
    const limit = filter.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.memoryModel
        .find(match)
        .skip(skip)
        .limit(limit)
        .sort({ date: -1 })
        .lean(),
      this.memoryModel.countDocuments(match),
    ]);

    return {
      total,
      page,
      limit,
      data,
    };
  }

  private async getAggregateMemoriesByPeriodOfTime(
    pipeline: PipelineStage[],
    aggregateBy: AggregateMemoriesTypeEnum,
  ): Promise<AggregatedMemoriesResult> {
    const result = await this.memoryModel.aggregate(pipeline);

    return formatAggregatedResult(result, aggregateBy);
  }

  async findAll(
    filter: FilterMemoriesDto,
  ): Promise<PaginationResponseDto<Memory> | AggregatedMemoriesResult> {
    const match: FilterQuery<Memory> = getMemoriesFilters(filter);

    const aggregateBy = filter.aggregateBy;

    if (!aggregateBy) {
      return this.getPaginationMemories(filter, match);
    }

    const pipeline: PipelineStage[] = getMemoriesAggregation(
      match,
      aggregateBy,
    );

    return this.getAggregateMemoriesByPeriodOfTime(pipeline, aggregateBy);
  }

  async update(id: string, dto: UpdateMemoryDto): Promise<Memory> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid memory ID');
    }

    return this.memoryModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async delete(id: string): Promise<{ message: string }> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid memory ID');
    }

    const result = await this.memoryModel.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundException('Memory not found');
    }

    return {
      message: `Memory with id: ${id} was deleted successfully`,
    };
  }
}
