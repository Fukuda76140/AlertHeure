export interface WorkConfig {
  workHours: 36 | 39;
  lunchBreak: number; // en minutes
}

export interface TimeEntry {
  date: string;
  startTime: string;
  endTime: string | null;
  breakDuration: number;
  totalWorked: number; // en minutes
  overtime: number; // en minutes
}