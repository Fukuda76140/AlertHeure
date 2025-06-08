export const getWorkHoursPerDay = (weeklyHours: 36 | 39): number => {
  if (weeklyHours === 36) {
    return 7 * 60 + 12; // 7h12 en minutes
  }
  return 7 * 60 + 48; // 7h48 en minutes
};

export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h${mins.toString().padStart(2, '0')}`;
};

export const formatTimeWithSeconds = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h${minutes.toString().padStart(2, '0')}m${seconds.toString().padStart(2, '0')}s`;
};

export const getCurrentTimeString = (): string => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
};

export const getTodayDateString = (): string => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};