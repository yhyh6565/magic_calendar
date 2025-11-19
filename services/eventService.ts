import * as chrono from 'chrono-node';
import ICAL from 'ical.js';
import { CalendarEvent } from '../types';

export const parseTextToEvent = (text: string): CalendarEvent => {
    const results = chrono.parse(text);

    if (results.length === 0) {
        throw new Error("Could not find any date or time in the text.");
    }

    const result = results[0];
    const startDate = result.start.date();
    const endDate = result.end ? result.end.date() : new Date(startDate.getTime() + 60 * 60 * 1000); // Default 1 hour

    // Remove the matched date text from the original text to get the title
    let title = text.replace(result.text, '').trim();
    // Clean up extra spaces and common prepositions if they are at the start/end
    title = title.replace(/^at\s+/i, '').replace(/^on\s+/i, '').replace(/\s+at$/i, '').trim();

    if (!title) {
        title = "New Event";
    }

    return {
        title,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        allDay: !result.start.isCertain('hour'), // If no hour specified, assume all day? Or maybe just check if time was mentioned.
        description: text, // Keep original text as description
    };
};

export const parseIcsToEvent = (icsContent: string): CalendarEvent => {
    try {
        const jcalData = ICAL.parse(icsContent);
        const comp = new ICAL.Component(jcalData);
        const vevent = comp.getFirstSubcomponent('vevent');

        if (!vevent) {
            throw new Error("No event found in ICS file.");
        }

        const event = new ICAL.Event(vevent);

        return {
            title: event.summary || "Untitled Event",
            description: event.description || "",
            location: event.location || "",
            startDate: event.startDate.toJSDate().toISOString(),
            endDate: event.endDate.toJSDate().toISOString(),
            allDay: event.startDate.isDate, // isDate is true if it's just a date (no time)
        };
    } catch (error) {
        console.error("ICS Parse Error:", error);
        throw new Error("Failed to parse ICS file.");
    }
};
