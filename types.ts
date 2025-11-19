export interface CalendarEvent {
  title: string;
  description?: string;
  location?: string;
  startDate: string; // ISO String
  endDate: string; // ISO String
  allDay: boolean;
}

export enum CalendarType {
  GOOGLE = 'GOOGLE',
  APPLE = 'APPLE', // Generates .ics blob
}

export interface ParseResult {
  event: CalendarEvent | null;
  error?: string;
}