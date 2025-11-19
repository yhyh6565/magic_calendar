import React, { useState } from 'react';
import { CalendarEvent } from '../types';
import { generateGoogleCalendarLink, addToAppleCalendar } from '../utils/dateUtils';
import { CheckCircle, Calendar, Clock, MapPin, AlignLeft, Copy, Check, ArrowLeft, Sparkles } from 'lucide-react';

interface EventPreviewProps {
  event: CalendarEvent;
  onReset: () => void;
}

const EventPreview: React.FC<EventPreviewProps> = ({ event, onReset }) => {
  const [copied, setCopied] = useState(false);

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

  const handleCopyDetails = () => {
    const details = `${event.title}
Date: ${dateString}
Time: ${timeString}${event.location ? `\nLocation: ${event.location}` : ''}${event.description ? `\nDescription: ${event.description}` : ''}`;

    navigator.clipboard.writeText(details).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-xl animate-success border border-slate-100 hover:shadow-2xl transition-all">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2.5">
          <div className="relative">
            <CheckCircle className="text-green-500 w-6 h-6 animate-scale-in" />
            <Sparkles className="w-3 h-3 text-green-400 absolute -top-1 -right-1 animate-pulse" />
          </div>
          Event Ready!
        </h2>
        <button
          onClick={onReset}
          className="text-sm text-slate-500 hover:text-slate-700 transition-all flex items-center gap-1.5 hover:gap-2 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Start Over
        </button>
      </div>

      <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-xl p-6 border-2 border-slate-100 mb-6 relative overflow-hidden group hover:border-blue-200 transition-all">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-500 to-purple-500"></div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>

        <div className="flex items-start justify-between gap-4 mb-4 relative">
          <h3 className="text-2xl font-bold text-slate-900 flex-1">{event.title}</h3>
          <button
            onClick={handleCopyDetails}
            className="p-2 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200 hover:shadow-sm group/copy"
            title="Copy event details"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-slate-400 group-hover/copy:text-blue-600" />
            )}
          </button>
        </div>

        <div className="flex flex-col gap-3 text-slate-700 text-sm relative">
          <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors">
            <Calendar className="w-4 h-4 mt-0.5 text-blue-600 shrink-0" />
            <span className="font-medium">{dateString}</span>
          </div>
          <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors">
            <Clock className="w-4 h-4 mt-0.5 text-blue-600 shrink-0" />
            <span className="font-medium">{timeString}</span>
          </div>
          {event.location && (
            <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors">
              <MapPin className="w-4 h-4 mt-0.5 text-blue-600 shrink-0" />
              <span>{event.location}</span>
            </div>
          )}
          {event.description && (
            <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors">
              <AlignLeft className="w-4 h-4 mt-0.5 text-blue-600 shrink-0" />
              <span className="text-slate-600">{event.description}</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide text-center mb-3">Add to Calendar</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleGoogleClick}
            className="flex items-center justify-center gap-3 w-full py-3.5 px-4 bg-white border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-xl font-semibold transition-all group shadow-sm hover:shadow-md"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Google Calendar</span>
          </button>

          <button
            onClick={handleAppleClick}
            className="flex items-center justify-center gap-3 w-full py-3.5 px-4 bg-white border-2 border-slate-200 hover:border-slate-700 hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-xl font-semibold transition-all group shadow-sm hover:shadow-md"
          >
            <svg className="w-5 h-5 text-slate-700 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.21-1.96 1.07-3.11-1.05.05-2.31.71-3.06 1.58-.69.8-1.26 2.09-1.1 3.21 1.17.08 2.35-.6 3.09-1.68z" />
            </svg>
            <span>Apple Calendar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventPreview;