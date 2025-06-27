import { UA_MONTHS } from '../consts';
import { formatDate, getStartDateOfISOWeek } from './date.helper';
import { AggregateMemoriesTypeEnum } from '../enums';
import {
  AggregatedDoc,
  AggregatedMemoriesResult,
  MemoryGroupByMonth,
  MemoryGroupByWeek,
  MemoryGroupByYear,
} from '../../modules/memories/dtos';

export function formatAggregatedResult(
  docs: AggregatedDoc[],
  mode: AggregateMemoriesTypeEnum,
): AggregatedMemoriesResult {
  if (mode === AggregateMemoriesTypeEnum.YEAR) {
    const grouped: MemoryGroupByYear = {};
    for (const doc of docs) {
      const year = doc._id;
      grouped[year] ||= [];
      grouped[year].push(...doc.memories);
    }
    return grouped;
  }

  if (mode === AggregateMemoriesTypeEnum.MONTH) {
    const grouped: MemoryGroupByMonth = {};
    for (const doc of docs) {
      const { year, month } = doc._id;
      const monthName = UA_MONTHS[month - 1];
      grouped[year] ||= {};
      grouped[year][monthName] ||= [];
      grouped[year][monthName].push(...doc.memories);
    }
    return grouped;
  }

  if (mode === AggregateMemoriesTypeEnum.WEEK) {
    const grouped: MemoryGroupByWeek = {};
    for (const doc of docs) {
      const { year, week } = doc._id;
      const start = getStartDateOfISOWeek(week, year);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      const label = `${week} тиждень (${formatDate(start)}–${formatDate(end)})`;

      grouped[year] ||= {};
      grouped[year][label] ||= [];
      grouped[year][label].push(...doc.memories);
    }
    return grouped;
  }

  return {};
}
