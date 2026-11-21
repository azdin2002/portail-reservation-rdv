const DAYS_SHORT = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const DAYS_LONG = [
  'Dimanche',
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
];
const MONTHS_LONG = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];

export function parseIsoDate(isoDate: string): Date {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(y || 2026, (m || 11) - 1, d || 18);
}

export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatFrenchFullDate(isoDate: string): string {
  const d = parseIsoDate(isoDate);
  const dayName = DAYS_LONG[d.getDay()];
  const dayNum = d.getDate();
  const monthName = MONTHS_LONG[d.getMonth()];
  const year = d.getFullYear();
  return `${dayName} ${dayNum} ${monthName} ${year}`;
}

export interface WeekDayInfo {
  isoDate: string;
  dayShort: string;
  dayNumber: number;
  isClosed: boolean;
  freeSlotsCount: number;
}

export function getWeekDaysFromMonday(mondayIsoDate: string): WeekDayInfo[] {
  const monday = parseIsoDate(mondayIsoDate);
  const freeCounts = [3, 7, 5, 2, 1, 0, 0];
  const result: WeekDayInfo[] = [];

  for (let i = 0; i < 7; i++) {
    const cur = new Date(monday);
    cur.setDate(monday.getDate() + i);
    const dayOfWeek = cur.getDay(); // 0 = Sun, 6 = Sat
    const isClosed = dayOfWeek === 0 || dayOfWeek === 6;
    result.push({
      isoDate: toIsoDate(cur),
      dayShort: DAYS_SHORT[dayOfWeek],
      dayNumber: cur.getDate(),
      isClosed,
      freeSlotsCount: isClosed ? 0 : freeCounts[i] ?? 4,
    });
  }
  return result;
}

export function formatWeekRangeTitle(mondayIsoDate: string): string {
  const monday = parseIsoDate(mondayIsoDate);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const startDay = monday.getDate();
  const endDay = sunday.getDate();
  const monthName = MONTHS_LONG[sunday.getMonth()];
  const year = sunday.getFullYear();

  return `Semaine du ${startDay} au ${endDay} ${monthName} ${year}`;
}
