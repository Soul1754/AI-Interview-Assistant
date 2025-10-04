// app/interview/[interviewId]/start/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useInterview } from '@/hooks/useInterview';
import { QuestionDisplay } from '@/app/components/ui/QuestionDisplay';
import { AudioRecorder } from '@/app/components/ui/AudioRecorder';
import { TranscriptDisplay } from '@/app/components/ui/TranscriptDisplay';
import { FeedbackCard } from '@/app/components/ui/FeedbackCard';
import type { Evaluation } from '@/hooks/useInterview';

export default function InterviewPage() {
  const params = useParams();
  const sessionId = params.interviewId as string;
  
  const {
    currentQuestion,
    isLoading,
    error,
    transcript,
    isCompleted,
    fetchCurrentQuestion,
    transcribeAudio,
    submitAnswer,
    completeInterview,
    synthesizeSpeech,
    playAudio,
    setTranscript,
  } = useInterview(sessionId);

  const [currentEvaluation, setCurrentEvaluation] = useState<Evaluation | null>(null);
  const [finalReport, setFinalReport] = useState<any>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch first question on mount
  useEffect(() => {
    fetchCurrentQuestion();
  }, [fetchCurrentQuestion]);

  // When question changes, play audio
  useEffect(() => {
    if (currentQuestion) {
      handleSpeakQuestion(currentQuestion.question.text);
    }
  }, [currentQuestion]);

  // Handle interview completion
  useEffect(() => {
    if (isCompleted && !finalReport) {
      handleCompleteInterview();
    }
  }, [isCompleted]);

  const handleSpeakQuestion = async (text: string) => {
    try {
      const audioBase64 = await synthesizeSpeech(text);
      playAudio(audioBase64);
    } catch (error) {
      console.error('Failed to speak question:', error);
    }
  };

  const handleRecordingComplete = async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);
      
      // Transcribe audio
      const transcribedText = await transcribeAudio(audioBlob);
      
      if (!currentQuestion) return;

      // Submit answer and get evaluation
      const evaluation = await submitAnswer(
        currentQuestion.question.id,
        transcribedText
      );

      // Show feedback
      setCurrentEvaluation(evaluation);
      setShowFeedback(true);
      
      // Speak feedback
      await handleSpeakQuestion(evaluation.feedback);
    } catch (error) {
      console.error('Failed to process answer:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinue = async () => {
    setShowFeedback(false);
    setCurrentEvaluation(null);
    setTranscript('');
    
    // Fetch next question
    await fetchCurrentQuestion();
  };

  const handleCompleteInterview = async () => {
    try {
      const report = await completeInterview();
      setFinalReport(report);
      
      // Speak final report
      await handleSpeakQuestion(report.summary);
    } catch (error) {
      console.error('Failed to complete interview:', error);
    }
  };

  if (isLoading && !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading interview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (finalReport) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
              🎉 Interview Complete!
            </h1>
            
            {/* Overall Score */}
            <div className="text-center mb-8">
              <div className="text-7xl font-bold text-blue-600 mb-2">
                {finalReport.overallScore.toFixed(1)}
              </div>
              <div className="text-gray-600">Overall Score</div>
            </div>

            {/* Summary */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">Summary</h2>
              <p className="text-gray-700 leading-relaxed">{finalReport.summary}</p>
            </div>

            {/* Detailed Feedback */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                Detailed Feedback
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {finalReport.detailedFeedback}
              </p>
            </div>

            {/* Recommendations */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                Recommendations
              </h2>
              <ul className="list-disc list-inside space-y-2">
                {finalReport.recommendations.map((rec: string, idx: number) => (
                  <li key={idx} className="text-gray-700">
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex justify-center space-x-4 mt-8">
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Download Report
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">AI Interview</h1>
          <p className="text-gray-600">Answer questions naturally - we'll evaluate your responses</p>
        </div>

        {/* Show feedback or question */}
        {showFeedback && currentEvaluation ? (
          <FeedbackCard evaluation={currentEvaluation} onContinue={handleContinue} />
        ) : currentQuestion ? (
          <>
            <QuestionDisplay question={currentQuestion} />
            
            <TranscriptDisplay transcript={transcript} isProcessing={isProcessing} />
            
            <AudioRecorder
              onRecordingComplete={handleRecordingComplete}
              disabled={isProcessing}
            />
          </>
        ) : (
          <div className="text-center text-gray-600">
            <p>Loading next question...</p>
          </div>
        )}

        {/* Loading overlay */}
        {isProcessing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4" />
              <p className="text-gray-700 font-semibold">Processing your answer...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
