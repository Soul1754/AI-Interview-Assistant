// app/components/ui/FeedbackCard.tsx
'use client';

import React from 'react';
import { Evaluation } from '@/hooks/useInterview';

interface FeedbackCardProps {
  evaluation: Evaluation;
  onContinue: () => void;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({
  evaluation,
  onContinue,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg border-2 border-blue-200">
      {/* Score */}
      <div className="text-center mb-6">
        <div className={`text-6xl font-bold ${getScoreColor(evaluation.score)}`}>
          {evaluation.score.toFixed(1)}
        </div>
        <div className="text-gray-600 text-sm">out of 10</div>
      </div>

      {/* Feedback */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Feedback</h3>
        <p className="text-gray-700 leading-relaxed">{evaluation.feedback}</p>
      </div>

      {/* Strengths */}
      {evaluation.strengths.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-green-700 mb-2">✅ Strengths</h3>
          <ul className="list-disc list-inside space-y-1">
            {evaluation.strengths.map((strength, idx) => (
              <li key={idx} className="text-gray-700">
                {strength}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Weaknesses */}
      {evaluation.weaknesses.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-orange-700 mb-2">
            💡 Areas for Improvement
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {evaluation.weaknesses.map((weakness, idx) => (
              <li key={idx} className="text-gray-700">
                {weakness}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Follow-up */}
      {evaluation.followUpQuestion && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Follow-up Question</h3>
          <p className="text-blue-900">{evaluation.followUpQuestion}</p>
        </div>
      )}

      {/* Continue button */}
      <div className="text-center">
        <button
          onClick={onContinue}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          Continue to Next Question →
        </button>
      </div>
    </div>
  );
};
