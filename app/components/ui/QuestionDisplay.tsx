// app/components/ui/QuestionDisplay.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { CurrentQuestion } from '@/hooks/useInterview';

interface QuestionDisplayProps {
  question: CurrentQuestion;
  onSpeakComplete?: () => void;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  onSpeakComplete,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Auto-play question audio when question changes
    // This would integrate with TTS service
    setIsSpeaking(true);
    
    // Simulate speech completion
    const timer = setTimeout(() => {
      setIsSpeaking(false);
      onSpeakComplete?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [question, onSpeakComplete]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toUpperCase()) {
      case 'EASY':
        return 'text-green-600 bg-green-100';
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-100';
      case 'HARD':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Progress indicator */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Round {question.roundNumber} of {question.totalRounds}: {question.round.name}</span>
          <span>Question {question.questionNumber} of {question.totalInRound}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((question.roundNumber - 1) / question.totalRounds) * 100 +
                (question.questionNumber / question.totalInRound) * (100 / question.totalRounds)}%`,
            }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-bold text-gray-800">Question</h2>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(
              question.question.difficulty
            )}`}
          >
            {question.question.difficulty}
          </span>
        </div>
        <p className="text-lg text-gray-700 leading-relaxed">
          {question.question.text}
        </p>
      </div>

      {/* Speaking indicator */}
      {isSpeaking && (
        <div className="flex items-center space-x-2 text-blue-600 animate-pulse">
          <div className="flex space-x-1">
            <div className="w-2 h-4 bg-blue-600 rounded animate-wave" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-4 bg-blue-600 rounded animate-wave" style={{ animationDelay: '100ms' }} />
            <div className="w-2 h-4 bg-blue-600 rounded animate-wave" style={{ animationDelay: '200ms' }} />
          </div>
          <span className="text-sm">Playing question...</span>
        </div>
      )}
    </div>
  );
};
