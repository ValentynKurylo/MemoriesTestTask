export function getStartDateOfISOWeek(week: number, year: number): Date {
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dow = simple.getDay();
  const ISOWeekStart = simple;
  if (dow <= 4) ISOWeekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else ISOWeekStart.setDate(simple.getDate() + 8 - simple.getDay());
  return ISOWeekStart;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' });
}
