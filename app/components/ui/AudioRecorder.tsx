// app/components/ui/AudioRecorder.tsx
'use client';

import React, { useState } from 'react';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  disabled?: boolean;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onRecordingComplete,
  disabled = false,
}) => {
  const { isRecording, audioBlob, startRecording, stopRecording, resetRecording } =
    useAudioRecorder();
  const [recordingTime, setRecordingTime] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const handleStartRecording = async () => {
    try {
      await startRecording();
      const id = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      setIntervalId(id);
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Failed to access microphone. Please check permissions.');
    }
  };

  const handleStopRecording = () => {
    stopRecording();
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setRecordingTime(0);
  };

  const handleSubmit = () => {
    if (audioBlob) {
      onRecordingComplete(audioBlob);
      resetRecording();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-md">
      <div className="text-center">
        {isRecording && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-lg font-mono">{formatTime(recordingTime)}</span>
          </div>
        )}
      </div>

      <div className="flex space-x-4">
        {!isRecording && !audioBlob && (
          <button
            onClick={handleStartRecording}
            disabled={disabled}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            🎤 Start Recording
          </button>
        )}

        {isRecording && (
          <button
            onClick={handleStopRecording}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            ⏹️ Stop Recording
          </button>
        )}

        {audioBlob && (
          <>
            <audio
              src={URL.createObjectURL(audioBlob)}
              controls
              className="w-64"
            />
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              ✅ Submit Answer
            </button>
            <button
              onClick={resetRecording}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              🔄 Re-record
            </button>
          </>
        )}
      </div>
    </div>
  );
};
