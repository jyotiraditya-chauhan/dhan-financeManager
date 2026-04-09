export const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export const formatDate = (isoDate: string): string => {
  const d = new Date(isoDate);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

export const formatMonthYear = (isoDate: string): string => {
  const d = new Date(isoDate);
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

export const formatTime = (isoDate: string): string => {
  const d = new Date(isoDate);
  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
};

export const isSameMonth = (a: string, b: string): boolean => {
  const da = new Date(a);
  const db = new Date(b);
  return da.getMonth() === db.getMonth() && da.getFullYear() === db.getFullYear();
};

export const isSameDay = (a: string, b: string): boolean => {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getDate() === db.getDate() &&
    da.getMonth() === db.getMonth() &&
    da.getFullYear() === db.getFullYear()
  );
};

export const getMonthKey = (isoDate: string): string => {
  const d = new Date(isoDate);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

export const getAvailableMonths = (dates: string[]): string[] => {
  const keys = [...new Set(dates.map(getMonthKey))];
  return keys.sort((a, b) => b.localeCompare(a));
};

export const monthKeyToLabel = (key: string): string => {
  const [year, month] = key.split('-');
  return `${MONTHS[parseInt(month, 10) - 1]} ${year}`;
};

export const getCurrentMonthKey = (): string => {
  return getMonthKey(new Date().toISOString());
};

export const toDateString = (date: Date): string => {
  return date.toISOString();
};

export const formatSectionDate = (isoDate: string): string => {
  const d = new Date(isoDate);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(isoDate, today.toISOString())) {
    return 'Today';
  }
  if (isSameDay(isoDate, yesterday.toISOString())) {
    return 'Yesterday';
  }
  return formatDate(isoDate);
};
