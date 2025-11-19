import { CalendarEvent } from '../types';

/**
 * Formats a date string into Google Calendar's expected format: YYYYMMDDThhmmssZ
 */
const formatGoogleDate = (dateStr: string, allDay: boolean): string => {
  const date = new Date(dateStr);
  
  if (allDay) {
    // YYYYMMDD
    return date.toISOString().replace(/-|:|\.\d\d\d/g, "").substring(0, 8);
  }

  // YYYYMMDDThhmmssZ
  return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
};

/**
 * Generates a Google Calendar web link
 */
export const generateGoogleCalendarLink = (event: CalendarEvent): string => {
  const baseUrl = "https://calendar.google.com/calendar/render";
  const action = "TEMPLATE";
  const text = encodeURIComponent(event.title);
  
  // Calculate dates
  let startFormatted = formatGoogleDate(event.startDate, event.allDay);
  let endFormatted = formatGoogleDate(event.endDate, event.allDay);

  // If all day, Google expects the end date to be +1 day for single day events
  if (event.allDay && startFormatted === endFormatted) {
      const endDateObj = new Date(event.endDate);
      endDateObj.setDate(endDateObj.getDate() + 1);
      endFormatted = formatGoogleDate(endDateObj.toISOString(), true);
  }

  const dates = `${startFormatted}/${endFormatted}`;
  const details = encodeURIComponent(event.description || "");
  const location = encodeURIComponent(event.location || "");

  return `${baseUrl}?action=${action}&text=${text}&dates=${dates}&details=${details}&location=${location}`;
};

/**
 * Generates an ICS file content string
 */
export const generateICSFileContent = (event: CalendarEvent): string => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toISOString().replace(/-|:|\.\d\d\d/g, "");
  };

  const now = formatDate(new Date().toISOString());
  const start = formatDate(event.startDate);
  const end = formatDate(event.endDate);

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Magic Calendar//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
DTSTAMP:${now}
DTSTART:${start}
DTEND:${end}
SUMMARY:${event.title}
DESCRIPTION:${(event.description || '').replace(/\n/g, '\\n')}
LOCATION:${event.location || ''}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;
};

/**
 * Handles adding the event to Apple Calendar (or other ICS supports).
 * On iOS, it attempts to open the event directly.
 * On Desktop/Android, it downloads the .ics file.
 */
export const addToAppleCalendar = (event: CalendarEvent) => {
  const content = generateICSFileContent(event);
  const fileName = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
  
  // Detect iOS (iPhone, iPad, iPod)
  // Note: Modern iPads often report as MacIntel, so we check maxTouchPoints
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  if (isIOS) {
    // On iOS, downloading a file often sends it to the "Files" app, which is a poor UX.
    // Navigating directly to a text/calendar Data URI typically triggers the native 
    // "Add to Calendar" modal directly.
    const dataUrl = `data:text/calendar;charset=utf-8,${encodeURIComponent(content)}`;
    window.location.href = dataUrl;
  } else {
    // For Desktop and Android, downloading the ICS file is the standard and reliable behavior.
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};