import { Memory } from '../../schemas';

export type MemoryGroupByYear = {
  [year: string]: Memory[];
};

export type MemoryGroupByMonth = {
  [year: string]: {
    [ukMonthName: string]: Memory[];
  };
};

export type MemoryGroupByWeek = {
  [year: string]: {
    [weekLabel: string]: Memory[];
  };
};

export type AggregatedDoc = {
  _id: any;
  memories: Memory[];
};

export type AggregatedMemoriesResult =
  | MemoryGroupByYear
  | MemoryGroupByMonth
  | MemoryGroupByWeek;
