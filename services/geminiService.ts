import { GoogleGenAI, Type, Schema } from "@google/genai";
import { CalendarEvent } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

const eventSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "The title of the event" },
    location: { type: Type.STRING, description: "The physical location or link" },
    description: { type: Type.STRING, description: "A brief description of the event" },
    startDate: { type: Type.STRING, description: "Start date in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)" },
    endDate: { type: Type.STRING, description: "End date in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)" },
    allDay: { type: Type.BOOLEAN, description: "True if the event lasts all day, otherwise false" },
  },
  required: ["title", "startDate", "endDate", "allDay"],
};

export const extractEventFromText = async (text: string): Promise<CalendarEvent> => {
  const client = getClient();
  const today = new Date().toISOString();
  
  const prompt = `
    Current Date/Time: ${today}.
    Extract calendar event details from the following text. 
    If the year is missing, assume the next occurrence relative to current date.
    If the duration is not specified, assume 1 hour.
    Input Text: "${text}"
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: eventSchema,
      },
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No data returned");
    
    const data = JSON.parse(resultText) as CalendarEvent;
    return data;
  } catch (error) {
    console.error("Gemini extraction error:", error);
    throw new Error("Failed to process event details.");
  }
};