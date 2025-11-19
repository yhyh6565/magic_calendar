import React, { useState, useRef, useEffect } from 'react';
import Spinner from './Spinner';
import { parseTextToEvent, parseIcsToEvent } from '../services/eventService';
import { CalendarEvent } from '../types';
import { Zap, UploadCloud, Sparkles } from 'lucide-react';

interface EventFormProps {
  onEventGenerated: (event: CalendarEvent) => void;
  onError: (msg: string) => void;
}

const EXAMPLE_PROMPTS = [
  "Dinner with Sarah at 7 PM tomorrow at Mario's Italian Restaurant",
  "Team meeting next Monday at 2 PM in Conference Room A",
  "Coffee with John at 10 AM on Friday at Starbucks downtown",
  "Dentist appointment next Wednesday at 3:30 PM",
  "Yoga class every Tuesday at 6 PM starting next week"
];

const EventForm: React.FC<EventFormProps> = ({ onEventGenerated, onError }) => {
  const [inputMode, setInputMode] = useState<'text' | 'file'>('text');
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentExample, setCurrentExample] = useState(0);
  const [showExamples, setShowExamples] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Rotate example prompts
  useEffect(() => {
    if (!textInput && showExamples) {
      const interval = setInterval(() => {
        setCurrentExample((prev) => (prev + 1) % EXAMPLE_PROMPTS.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [textInput, showExamples]);

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
      onError("Could not find a valid date/time in your text. Please try again with a different format.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleTextSubmit();
    }
  };

  const handleUseExample = () => {
    setTextInput(EXAMPLE_PROMPTS[currentExample]);
    setShowExamples(false);
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
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-xl transition-all duration-300 border border-slate-100 animate-scale-in hover:shadow-2xl">
      <div className="flex mb-6 border-b border-slate-100">
        <button
          className={`flex-1 pb-3 text-sm font-semibold transition-all relative group ${inputMode === 'text' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          onClick={() => setInputMode('text')}
        >
          <span className="inline-flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Text Input
          </span>
          {inputMode === 'text' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-full animate-slide-in" />
          )}
        </button>
        <button
          className={`flex-1 pb-3 text-sm font-semibold transition-all relative group ${inputMode === 'file' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          onClick={() => setInputMode('file')}
        >
          <span className="inline-flex items-center gap-2">
            <UploadCloud className="w-4 h-4" />
            Upload File
          </span>
          {inputMode === 'file' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-full animate-slide-in" />
          )}
        </button>
      </div>

      <div className="min-h-[240px]">
        {inputMode === 'text' ? (
          <div className="flex flex-col h-full animate-fade-in">
            <div className="relative">
              <textarea
                className="w-full p-4 bg-gradient-to-br from-slate-50 to-blue-50/30 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none resize-none text-slate-700 placeholder-slate-400 transition-all min-h-[140px]"
                placeholder={EXAMPLE_PROMPTS[currentExample]}
                rows={5}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {!textInput && (
                <button
                  onClick={handleUseExample}
                  className="absolute bottom-3 right-3 text-xs px-3 py-1.5 bg-white/80 hover:bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-blue-600 transition-all shadow-sm hover:shadow"
                >
                  Try this example
                </button>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <kbd className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-mono">⌘</kbd>
                <span>+</span>
                <kbd className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-mono">Enter</kbd>
                <span className="ml-1">to create</span>
              </p>
              <button
                onClick={handleTextSubmit}
                disabled={isProcessing || !textInput.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:from-slate-400 disabled:to-slate-400 group"
              >
                {isProcessing ? <Spinner /> : <Zap className="w-4 h-4 group-hover:rotate-12 transition-transform" />}
                {isProcessing ? 'Processing...' : 'Create Event'}
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col justify-center items-center border-2 border-dashed border-slate-300 rounded-xl p-8 bg-gradient-to-br from-slate-50 to-blue-50/30 hover:border-blue-400 hover:bg-blue-50/40 transition-all cursor-pointer relative group animate-fade-in">
            <input
              type="file"
              accept=".ics"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="bg-white p-4 rounded-full shadow-md mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
              <UploadCloud className="w-8 h-8 text-blue-500 group-hover:text-purple-500 transition-colors" />
            </div>
            <p className="text-sm font-semibold text-slate-700 mb-1">
              Click to upload or drag & drop
            </p>
            <p className="text-xs text-slate-500 mb-2">
              Supports .ics calendar files
            </p>
            <div className="flex gap-2 mt-2">
              <span className="px-2 py-1 bg-white/60 rounded text-xs text-slate-600 font-mono">.ics</span>
            </div>
            {isProcessing && (
              <div className="absolute inset-0 bg-white/90 flex items-center justify-center rounded-xl z-20 backdrop-blur-sm">
                <div className="flex flex-col items-center text-blue-600">
                  <Spinner />
                  <span className="mt-2 text-sm font-semibold">Reading file...</span>
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