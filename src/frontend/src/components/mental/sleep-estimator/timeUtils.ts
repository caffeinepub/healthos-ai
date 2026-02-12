// Timezone-aware time parsing and formatting utilities

export function parseTimeInZone(dateStr: string, timeStr: string, timeZone: string): Date {
  // Parse HH:MM format
  const [hours, minutes] = timeStr.split(':').map(Number);
  
  // Create date in the specified timezone
  const dateTimeStr = `${dateStr}T${timeStr.padStart(5, '0')}:00`;
  
  try {
    // Use Intl API to handle timezone
    const date = new Date(dateTimeStr);
    return date;
  } catch (error) {
    throw new Error(`Invalid time format: ${timeStr}`);
  }
}

export function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function getHourFromTime(timeStr: string): number {
  const [hours] = timeStr.split(':').map(Number);
  return hours;
}

export function getMinutesFromTime(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

export function minutesToHoursMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${h}:${m.toString().padStart(2, '0')}`;
}

export function isValidTimeZone(tz: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

export function isValidTimeFormat(time: string): boolean {
  const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(time);
}

export function addMinutesToTime(timeStr: string, minutesToAdd: number): string {
  const totalMinutes = getMinutesFromTime(timeStr) + minutesToAdd;
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function timeDifferenceMinutes(time1: string, time2: string): number {
  // Calculate difference, handling day boundary
  const mins1 = getMinutesFromTime(time1);
  const mins2 = getMinutesFromTime(time2);
  
  let diff = mins2 - mins1;
  if (diff < 0) {
    diff += 24 * 60; // Add 24 hours if crossing midnight
  }
  
  return diff;
}
