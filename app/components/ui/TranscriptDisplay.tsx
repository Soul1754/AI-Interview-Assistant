// app/components/ui/TranscriptDisplay.tsx
'use client';

import React from 'react';

interface TranscriptDisplayProps {
  transcript: string;
  isProcessing?: boolean;
}

export const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({
  transcript,
  isProcessing = false,
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-700">Your Answer</h3>
        {isProcessing && (
          <span className="text-xs text-blue-600 animate-pulse">Processing...</span>
        )}
      </div>
      <div className="min-h-[60px] p-3 bg-white rounded border border-gray-300">
        {transcript ? (
          <p className="text-gray-800">{transcript}</p>
        ) : (
          <p className="text-gray-400 italic">Your transcribed answer will appear here...</p>
        )}
      </div>
    </div>
  );
};
