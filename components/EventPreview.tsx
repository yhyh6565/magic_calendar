import React from 'react';
import { CalendarEvent } from '../types';
import { generateGoogleCalendarLink, addToAppleCalendar } from '../utils/dateUtils';
import { CheckCircle, Calendar, Clock, MapPin, AlignLeft } from 'lucide-react';

interface EventPreviewProps {
  event: CalendarEvent;
  onReset: () => void;
}

const EventPreview: React.FC<EventPreviewProps> = ({ event, onReset }) => {

  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  const dateString = startDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const timeString = event.allDay
    ? 'All Day'
    : `${startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

  const handleGoogleClick = () => {
    const link = generateGoogleCalendarLink(event);
    window.open(link, '_blank');
  };

  const handleAppleClick = () => {
    addToAppleCalendar(event);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-xl animate-fade-in-up border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <CheckCircle className="text-green-500 w-5 h-5" />
          Event Ready
        </h2>
        <button onClick={onReset} className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
          Start Over
        </button>
      </div>

      <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary-500"></div>
        <h3 className="text-xl font-bold text-slate-900 mb-1">{event.title}</h3>

        <div className="flex flex-col gap-2 mt-4 text-slate-600 text-sm">
          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 mt-0.5 text-primary-500 shrink-0" />
            <span>{dateString}</span>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 mt-0.5 text-primary-500 shrink-0" />
            <span>{timeString}</span>
          </div>
          {event.location && (
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 mt-0.5 text-primary-500 shrink-0" />
              <span>{event.location}</span>
            </div>
          )}
          {event.description && (
            <div className="flex items-start gap-3 mt-1">
              <AlignLeft className="w-4 h-4 mt-0.5 text-primary-500 shrink-0" />
              <span className="line-clamp-3">{event.description}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={handleGoogleClick}
          className="flex items-center justify-center gap-3 w-full py-3.5 px-4 bg-white border-2 border-slate-200 hover:border-primary-500 hover:text-primary-600 text-slate-700 rounded-xl font-medium transition-all group"
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" alt="Google" className="w-6 h-6" />
          <span>Google Calendar</span>
        </button>

        <button
          onClick={handleAppleClick}
          className="flex items-center justify-center gap-3 w-full py-3.5 px-4 bg-white border-2 border-slate-200 hover:border-slate-800 hover:text-slate-900 text-slate-700 rounded-xl font-medium transition-all group"
        >
          <svg className="w-6 h-6 text-slate-800" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.21-1.96 1.07-3.11-1.05.05-2.31.71-3.06 1.58-.69.8-1.26 2.09-1.1 3.21 1.17.08 2.35-.6 3.09-1.68z" />
          </svg>
          <span>Apple Calendar</span>
        </button>
      </div>
      <p className="text-center text-xs text-slate-400 mt-4">
        Select your preferred calendar to add the event instantly.
      </p>
    </div>
  );
};

export default EventPreview;