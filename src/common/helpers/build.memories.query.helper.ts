import { FilterQuery, PipelineStage } from 'mongoose';
import { FilterMemoriesDto } from '../../modules/memories/dtos';
import { Memory } from '../../schemas';
import { AggregateMemoriesTypeEnum } from '../enums';

export function getMemoriesFilters(
  filter: FilterMemoriesDto,
): FilterQuery<Memory> {
  const match: FilterQuery<Memory> = {};

  if (filter.tags?.length === 1) {
    match.tags = { $in: filter.tags };
  } else if (filter.tags?.length > 1) {
    match.tags = { $all: filter.tags };
  }

  if (filter.emotion) match.emotion = filter.emotion;

  if (filter.from || filter.to) {
    match.date = {};
    if (filter.from) match.date.$gte = new Date(filter.from);
    if (filter.to) match.date.$lte = new Date(filter.to);
  }

  return match;
}

export function getMemoriesAggregation(
  match: FilterQuery<Memory>,
  aggregateBy: AggregateMemoriesTypeEnum,
): PipelineStage[] {
  const pipeline: PipelineStage[] = [];

  if (Object.keys(match).length) {
    pipeline.push({ $match: match });
  }

  pipeline.push({
    $addFields: {
      year: { $year: '$date' },
      month: { $month: '$date' },
      isoWeek: { $isoWeek: '$date' },
      isoWeekYear: { $isoWeekYear: '$date' },
    },
  });

  if (aggregateBy === 'year') {
    pipeline.push({
      $group: {
        _id: '$year',
        memories: { $push: '$$ROOT' },
      },
    });
  }

  if (aggregateBy === 'month') {
    pipeline.push({
      $group: {
        _id: { year: '$year', month: '$month' },
        memories: { $push: '$$ROOT' },
      },
    });
  }

  if (aggregateBy === 'week') {
    pipeline.push({
      $group: {
        _id: { year: '$isoWeekYear', week: '$isoWeek' },
        memories: { $push: '$$ROOT' },
      },
    });
  }

  return pipeline;
}
