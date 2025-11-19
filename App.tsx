import React, { useState, useEffect } from 'react';
import EventForm from './components/EventForm';
import EventPreview from './components/EventPreview';
import { CalendarEvent } from './types';
// @ts-ignore
import feather from 'feather-icons';

const App: React.FC = () => {
  const [event, setEvent] = useState<CalendarEvent | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    feather.replace();
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center p-4 md:p-6 font-sans">
      
      <header className="mb-10 text-center animate-fade-in-down">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-6 text-primary-600">
          <i data-feather="calendar" className="w-8 h-8"></i>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
          Magic Calendar
        </h1>
        <p className="text-slate-500 max-w-md mx-auto text-lg">
          Turn text or files into calendar events instantly.
        </p>
      </header>

      <main className="w-full flex flex-col items-center">
        {error && (
          <div className="w-full max-w-xl mb-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 animate-fade-in">
            <i data-feather="alert-circle" className="w-5 h-5"></i>
            {error}
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

      <footer className="mt-12 text-slate-400 text-sm">
        <p>Powered by Google Gemini</p>
      </footer>

      {/* Utility animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
        .animate-fade-in-down { animation: fadeInDown 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default App;