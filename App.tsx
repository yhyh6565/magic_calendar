import React, { useState } from 'react';
import EventForm from './components/EventForm';
import EventPreview from './components/EventPreview';
import { CalendarEvent } from './types';
import { Calendar, AlertCircle, Sparkles, X } from 'lucide-react';

const App: React.FC = () => {
  const [event, setEvent] = useState<CalendarEvent | null>(null);
  const [error, setError] = useState<string>('');

  const handleEventGenerated = (generatedEvent: CalendarEvent) => {
    setEvent(generatedEvent);
    setError('');
  };

  const handleError = (msg: string) => {
    setError(msg);
    setEvent(null);
  };

  const handleReset = () => {
    setEvent(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 flex flex-col items-center justify-center p-4 md:p-6 font-sans relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        <header className="mb-10 text-center animate-fade-in-down">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl shadow-2xl shadow-blue-500/30 mb-6 text-white relative group hover:scale-105 transition-transform">
            <Calendar className="w-10 h-10" />
            <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 tracking-tight mb-4">
            Magic Calendar
          </h1>
          <p className="text-slate-600 max-w-md mx-auto text-lg font-medium">
            Turn text or files into calendar events instantly
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-slate-500">Powered by AI-free local parsing</span>
          </div>
        </header>

        <main className="w-full flex flex-col items-center">
          {error && (
            <div className="w-full max-w-xl mb-6 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 text-red-700 px-5 py-4 rounded-xl flex items-start gap-3 animate-scale-in shadow-lg">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold mb-1">Oops! Something went wrong</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
              <button
                onClick={() => setError('')}
                className="p-1 hover:bg-red-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {!event ? (
            <EventForm
              onEventGenerated={handleEventGenerated}
              onError={handleError}
            />
          ) : (
            <EventPreview
              event={event}
              onReset={handleReset}
            />
          )}
        </main>

        <footer className="mt-12 text-slate-400 text-sm text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calendar className="w-4 h-4" />
            <p className="font-semibold">Magic Calendar</p>
          </div>
          <p className="text-xs text-slate-400">Built with React • Tailwind CSS • TypeScript</p>
        </footer>
      </div>
    </div>
  );
};

export default App;