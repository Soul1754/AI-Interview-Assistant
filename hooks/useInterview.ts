// hooks/useInterview.ts
'use client';

import { useState, useCallback } from 'react';
import axios from 'axios';

export interface CurrentQuestion {
  question: {
    id: string;
    text: string;
    difficulty: string;
  };
  round: {
    name: string;
  };
  questionNumber: number;
  totalInRound: number;
  roundNumber: number;
  totalRounds: number;
}

export interface Evaluation {
  score: number;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  followUpQuestion?: string;
}

export const useInterview = (sessionId: string) => {
  const [currentQuestion, setCurrentQuestion] = useState<CurrentQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState(false);

  const fetchCurrentQuestion = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(`/api/interview/current-question`, {
        params: { sessionId },
      });

      if (response.data.completed) {
        setIsCompleted(true);
        setCurrentQuestion(null);
      } else {
        setCurrentQuestion(response.data.currentQuestion);
      }
    } catch (err) {
      setError('Failed to fetch question');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const transcribeAudio = useCallback(async (audioBlob: Blob): Promise<string> => {
    try {
      setIsLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('audio', audioBlob);

      const response = await axios.post('/api/interview/transcribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const text = response.data.transcript;
      setTranscript(text);
      return text;
    } catch (err) {
      setError('Failed to transcribe audio');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitAnswer = useCallback(async (
    questionId: string,
    answerText: string
  ): Promise<Evaluation> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post('/api/interview/submit-answer', {
        sessionId,
        questionId,
        answerText,
      });

      return response.data.result.evaluation;
    } catch (err) {
      setError('Failed to submit answer');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const completeInterview = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post('/api/interview/complete', {
        sessionId,
      });

      return response.data.report;
    } catch (err) {
      setError('Failed to complete interview');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const synthesizeSpeech = useCallback(async (text: string): Promise<string> => {
    try {
      const response = await axios.post('/api/interview/synthesize', {
        text,
      });

      return response.data.audio; // Returns base64 audio
    } catch (err) {
      console.error('Failed to synthesize speech:', err);
      throw err;
    }
  }, []);

  const playAudio = useCallback((audioBase64: string) => {
    try {
      const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);
      audio.play();
      return audio;
    } catch (err) {
      console.error('Failed to play audio:', err);
      throw err;
    }
  }, []);

  return {
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
  };
};
