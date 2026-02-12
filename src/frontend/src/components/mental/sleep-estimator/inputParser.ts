// Structured input parsing for sleep estimator

import { SleepAnalysisInput, DailySleepInput } from './types';
import { isValidTimeFormat, isValidTimeZone } from './timeUtils';

export interface ParseResult {
  success: boolean;
  data?: SleepAnalysisInput;
  errors: string[];
}

export function parseStructuredInput(input: string, timeZone: string): ParseResult {
  const errors: string[] = [];
  const days: DailySleepInput[] = [];
  
  // Validate timezone
  if (!isValidTimeZone(timeZone)) {
    errors.push(`Invalid IANA time zone: ${timeZone}. Please use a valid timezone like "America/New_York" or "Europe/London".`);
    return { success: false, errors };
  }
  
  // Parse line-based format
  const lines = input.trim().split('\n');
  let currentDay: Partial<DailySleepInput> | null = null;
  let currentDate = '';
  let dayIndex = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Day header: "Day N:" or "YYYY-MM-DD:"
    if (line.match(/^(Day \d+|[\d-]+):/i)) {
      if (currentDay && currentDate) {
        // Save previous day
        if (validateDay(currentDay, currentDate, dayIndex, errors)) {
          days.push(currentDay as DailySleepInput);
        }
      }
      
      // Start new day
      dayIndex++;
      const match = line.match(/^Day (\d+):/i);
      if (match) {
        const dayNum = parseInt(match[1]);
        const date = new Date();
        date.setDate(date.getDate() - (dayNum - 1));
        currentDate = date.toISOString().split('T')[0];
      } else {
        currentDate = line.replace(':', '').trim();
      }
      
      currentDay = { date: currentDate, nightChecks: [] };
      continue;
    }
    
    if (!currentDay) continue;
    
    // Parse fields
    if (line.match(/^Last activity:/i)) {
      const time = line.split(':').slice(1).join(':').trim();
      if (isValidTimeFormat(time)) {
        currentDay.lastActivity = time;
      } else {
        errors.push(`Day ${dayIndex}: Invalid time format for last activity: "${time}". Expected HH:MM format (e.g., "23:45").`);
      }
    } else if (line.match(/^First activity:/i)) {
      const time = line.split(':').slice(1).join(':').trim();
      if (isValidTimeFormat(time)) {
        currentDay.firstActivity = time;
      } else {
        errors.push(`Day ${dayIndex}: Invalid time format for first activity: "${time}". Expected HH:MM format (e.g., "07:30").`);
      }
    } else if (line.match(/^Night checks:/i)) {
      const content = line.split(':').slice(1).join(':').trim();
      if (content === '0' || content.toLowerCase() === 'none') {
        currentDay.nightChecks = [];
      } else {
        // Parse night checks: "2 (02:14, 04:33)" or "1 (03:22)"
        const match = content.match(/\(([^)]+)\)/);
        if (match) {
          const times = match[1].split(',').map(t => t.trim());
          currentDay.nightChecks = times.map(time => ({ time }));
        }
      }
    } else if (line.match(/^Total screen time:/i)) {
      const content = line.split(':').slice(1).join(':').trim();
      const match = content.match(/(\d+)h?\s*(\d+)?m?/i);
      if (match) {
        const hours = parseInt(match[1]) || 0;
        const minutes = parseInt(match[2]) || 0;
        currentDay.totalScreenTimeMinutes = hours * 60 + minutes;
      } else {
        errors.push(`Day ${dayIndex}: Invalid screen time format: "${content}". Expected format like "5h 30m" or "5h 30".`);
      }
    }
  }
  
  // Save last day
  if (currentDay && currentDate) {
    dayIndex++;
    if (validateDay(currentDay, currentDate, dayIndex, errors)) {
      days.push(currentDay as DailySleepInput);
    }
  }
  
  // Validate day count
  if (days.length < 7) {
    errors.push(`Insufficient data: ${days.length} days provided, minimum 7 required for analysis.`);
  } else if (days.length > 30) {
    errors.push(`Too much data: ${days.length} days provided, maximum 30 allowed.`);
  }
  
  if (errors.length > 0) {
    return { success: false, errors };
  }
  
  return {
    success: true,
    data: { days, timeZone },
    errors: [],
  };
}

function validateDay(day: Partial<DailySleepInput>, date: string, dayIndex: number, errors: string[]): boolean {
  let valid = true;
  
  if (!day.lastActivity) {
    errors.push(`Day ${dayIndex} (${date}): Missing required field "Last activity".`);
    valid = false;
  }
  
  if (!day.firstActivity) {
    errors.push(`Day ${dayIndex} (${date}): Missing required field "First activity".`);
    valid = false;
  }
  
  if (day.totalScreenTimeMinutes === undefined) {
    errors.push(`Day ${dayIndex} (${date}): Missing required field "Total screen time".`);
    valid = false;
  }
  
  return valid;
}

export function parseJSONInput(input: string, timeZone: string): ParseResult {
  const errors: string[] = [];
  
  // Validate timezone
  if (!isValidTimeZone(timeZone)) {
    errors.push(`Invalid IANA time zone: ${timeZone}. Please use a valid timezone like "America/New_York" or "Europe/London".`);
    return { success: false, errors };
  }
  
  try {
    const data = JSON.parse(input);
    
    if (!Array.isArray(data)) {
      errors.push('JSON input must be an array of daily sleep records.');
      return { success: false, errors };
    }
    
    const days: DailySleepInput[] = [];
    
    for (let i = 0; i < data.length; i++) {
      const day = data[i];
      const dayIndex = i + 1;
      
      // Required fields
      if (!day.date) {
        errors.push(`Day ${dayIndex}: Missing required field "date".`);
        continue;
      }
      
      if (!day.lastActivity) {
        errors.push(`Day ${dayIndex} (${day.date}): Missing required field "lastActivity".`);
        continue;
      }
      
      if (!day.firstActivity) {
        errors.push(`Day ${dayIndex} (${day.date}): Missing required field "firstActivity".`);
        continue;
      }
      
      if (day.totalScreenTimeMinutes === undefined) {
        errors.push(`Day ${dayIndex} (${day.date}): Missing required field "totalScreenTimeMinutes".`);
        continue;
      }
      
      // Validate time formats
      if (!isValidTimeFormat(day.lastActivity)) {
        errors.push(`Day ${dayIndex} (${day.date}): Invalid time format for lastActivity: "${day.lastActivity}". Expected HH:MM format.`);
        continue;
      }
      
      if (!isValidTimeFormat(day.firstActivity)) {
        errors.push(`Day ${dayIndex} (${day.date}): Invalid time format for firstActivity: "${day.firstActivity}". Expected HH:MM format.`);
        continue;
      }
      
      // Build day object with optional ML-friendly fields
      const parsedDay: DailySleepInput = {
        date: day.date,
        lastActivity: day.lastActivity,
        firstActivity: day.firstActivity,
        totalScreenTimeMinutes: day.totalScreenTimeMinutes,
        nightChecks: day.nightChecks || [],
        // Optional ML fields
        hourlyScreenTime: day.hourlyScreenTime,
        hourlyUnlockCount: day.hourlyUnlockCount,
        unlockBurstTimes: day.unlockBurstTimes,
        inactivityBlocks: day.inactivityBlocks,
      };
      
      days.push(parsedDay);
    }
    
    // Validate day count
    if (days.length < 7) {
      errors.push(`Insufficient data: ${days.length} days provided, minimum 7 required for analysis.`);
    } else if (days.length > 30) {
      errors.push(`Too much data: ${days.length} days provided, maximum 30 allowed.`);
    }
    
    if (errors.length > 0) {
      return { success: false, errors };
    }
    
    return {
      success: true,
      data: { days, timeZone },
      errors: [],
    };
  } catch (e) {
    errors.push(`Invalid JSON format: ${e instanceof Error ? e.message : 'Unknown error'}`);
    return { success: false, errors };
  }
}
