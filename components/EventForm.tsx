import React, { useState, useRef } from 'react';
import Spinner from './Spinner';
import { parseTextToEvent, parseIcsToEvent } from '../services/eventService';
import { CalendarEvent } from '../types';
import { Zap, UploadCloud } from 'lucide-react';

interface EventFormProps {
  onEventGenerated: (event: CalendarEvent) => void;
  onError: (msg: string) => void;
}

const EventForm: React.FC<EventFormProps> = ({ onEventGenerated, onError }) => {
  const [inputMode, setInputMode] = useState<'text' | 'file'>('text');
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;
    setIsProcessing(true);
    onError('');

    // Simulate a small delay for better UX (so it doesn't feel too instant/glitchy)
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const eventData = parseTextToEvent(textInput);
      onEventGenerated(eventData);
    } catch (err) {
      onError("Could not find a valid date/time in your text. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    onError('');

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      try {
        const eventData = parseIcsToEvent(content);
        onEventGenerated(eventData);
      } catch (err) {
        onError("Could not parse the file. Please ensure it's a valid ICS file.");
      } finally {
        setIsProcessing(false);
        // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.onerror = () => {
      onError("Error reading file");
      setIsProcessing(false);
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-xl transition-all duration-300 border border-slate-100">
      <div className="flex mb-6 border-b border-slate-100">
        <button
          className={`flex-1 pb-3 text-sm font-medium transition-colors relative ${inputMode === 'text' ? 'text-primary-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          onClick={() => setInputMode('text')}
        >
          Text Input
          {inputMode === 'text' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-t-full" />
          )}
        </button>
        <button
          className={`flex-1 pb-3 text-sm font-medium transition-colors relative ${inputMode === 'file' ? 'text-primary-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          onClick={() => setInputMode('file')}
        >
          Upload File
          {inputMode === 'file' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-t-full" />
          )}
        </button>
      </div>

      <div className="min-h-[200px]">
        {inputMode === 'text' ? (
          <div className="flex flex-col h-full animate-fade-in">
            <textarea
              className="w-full flex-grow p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none text-slate-700 placeholder-slate-400 transition-all"
              placeholder="e.g., Dinner with Sarah at 7 PM tomorrow at Mario's Italian Restaurant"
              rows={5}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleTextSubmit}
                disabled={isProcessing || !textInput.trim()}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-primary-500/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {isProcessing ? <Spinner /> : <Zap className="w-4 h-4" />}
                {isProcessing ? 'Processing...' : 'Create Event'}
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col justify-center items-center border-2 border-dashed border-slate-200 rounded-xl p-8 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative group animate-fade-in">
            <input
              type="file"
              accept=".ics"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
              <UploadCloud className="w-8 h-8 text-primary-500" />
            </div>
            <p className="text-sm font-medium text-slate-700">
              Click to upload or drag & drop
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports .ics files
            </p>
            {isProcessing && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl z-20 backdrop-blur-sm">
                <div className="flex flex-col items-center text-primary-600">
                  <Spinner />
                  <span className="mt-2 text-sm font-medium">Reading file...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventForm;