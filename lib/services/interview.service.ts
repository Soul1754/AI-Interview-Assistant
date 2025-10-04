// lib/services/interview.service.ts
import { PrismaClient, DifficultyLevel, SessionStatus } from '@prisma/client';
import { llmService } from './llm.service';
import { sttService } from './stt.service';
import { ttsService } from './tts.service';

const prisma = new PrismaClient();

export interface QuestionSelection {
  [roundId: string]: {
    easy: string[];
    medium: string[];
    hard: string[];
  };
}

export class InterviewService {
  /**
   * Create interview template with rounds and generate questions
   */
  async createInterviewTemplate(
    companyId: string,
    data: {
      title: string;
      jobRole: string;
      skills: string[];
      jobDescription?: string;
      rounds: Array<{ name: string; order: number; description?: string }>;
    }
  ) {
    try {
      // Create template with rounds
      const template = await prisma.interviewTemplate.create({
        data: {
          companyId,
          title: data.title,
          jobRole: data.jobRole,
          skills: data.skills,
          jobDescription: data.jobDescription,
          rounds: {
            create: data.rounds,
          },
        },
        include: {
          rounds: true,
        },
      });

      // Generate questions for each round and difficulty level
      for (const round of template.rounds) {
        await this.generateQuestionsForRound(
          template.id,
          round.id,
          data.jobRole,
          data.skills,
          round.name,
          data.jobDescription
        );
      }

      return await prisma.interviewTemplate.findUnique({
        where: { id: template.id },
        include: {
          rounds: {
            include: {
              questions: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Template creation error:', error);
      throw error;
    }
  }

  /**
   * Generate 6 questions per difficulty level for a round
   */
  private async generateQuestionsForRound(
    templateId: string,
    roundId: string,
    jobRole: string,
    skills: string[],
    roundName: string,
    jobDescription?: string
  ) {
    const difficulties: DifficultyLevel[] = ['EASY', 'MEDIUM', 'HARD'];

    for (const difficulty of difficulties) {
      try {
        const questions = await llmService.generateQuestions(
          jobRole,
          skills,
          roundName,
          difficulty,
          6,
          jobDescription
        );

        // Store questions in database
        await prisma.question.createMany({
          data: questions.map(text => ({
            roundId,
            text,
            difficulty,
            category: roundName.toLowerCase(),
          })),
        });
      } catch (error) {
        console.error(`Error generating ${difficulty} questions for ${roundName}:`, error);
      }
    }
  }

  /**
   * Start a new interview session
   */
  async startSession(templateId: string, studentId: string, companyId: string) {
    try {
      const template = await prisma.interviewTemplate.findUnique({
        where: { id: templateId },
        include: {
          rounds: {
            include: {
              questions: true,
            },
            orderBy: { order: 'asc' },
          },
        },
      });

      if (!template) {
        throw new Error('Template not found');
      }

      // Randomly select 2 questions per difficulty per round
      const selectedQuestions: QuestionSelection = {};

      for (const round of template.rounds) {
        selectedQuestions[round.id] = {
          easy: this.randomSelectQuestions(round.questions, 'EASY', 2),
          medium: this.randomSelectQuestions(round.questions, 'MEDIUM', 2),
          hard: this.randomSelectQuestions(round.questions, 'HARD', 2),
        };
      }

      // Create session
      const session = await prisma.interviewSession.create({
        data: {
          templateId,
          companyId,
          studentId,
          status: 'IN_PROGRESS',
          selectedQuestions: selectedQuestions as any,
          transcript: [],
          currentRoundIndex: 0,
          currentQuestionIndex: 0,
          startedAt: new Date(),
        },
        include: {
          template: {
            include: {
              rounds: {
                include: {
                  questions: true,
                },
                orderBy: { order: 'asc' },
              },
            },
          },
          student: true,
        },
      });

      return session;
    } catch (error) {
      console.error('Session start error:', error);
      throw error;
    }
  }

  /**
   * Randomly select N questions of a specific difficulty
   */
  private randomSelectQuestions(
    questions: any[],
    difficulty: DifficultyLevel,
    count: number
  ): string[] {
    const filtered = questions.filter(q => q.difficulty === difficulty);
    const shuffled = filtered.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map(q => q.id);
  }

  /**
   * Get the current question for a session
   */
  async getCurrentQuestion(sessionId: string) {
    try {
      const session = await prisma.interviewSession.findUnique({
        where: { id: sessionId },
        include: {
          template: {
            include: {
              rounds: {
                orderBy: { order: 'asc' },
              },
            },
          },
        },
      });

      if (!session) {
        throw new Error('Session not found');
      }

      const rounds = session.template.rounds;
      if (session.currentRoundIndex >= rounds.length) {
        return null; // Interview complete
      }

      const currentRound = rounds[session.currentRoundIndex];
      const selectedForRound = (session.selectedQuestions as any)[currentRound.id];

      // Get all selected questions for this round in order: easy, medium, hard
      const allQuestionIds = [
        ...selectedForRound.easy,
        ...selectedForRound.medium,
        ...selectedForRound.hard,
      ];

      if (session.currentQuestionIndex >= allQuestionIds.length) {
        // Move to next round
        await prisma.interviewSession.update({
          where: { id: sessionId },
          data: {
            currentRoundIndex: session.currentRoundIndex + 1,
            currentQuestionIndex: 0,
          },
        });

        return this.getCurrentQuestion(sessionId);
      }

      const questionId = allQuestionIds[session.currentQuestionIndex];
      const question = await prisma.question.findUnique({
        where: { id: questionId },
      });

      return {
        question,
        round: currentRound,
        questionNumber: session.currentQuestionIndex + 1,
        totalInRound: allQuestionIds.length,
        roundNumber: session.currentRoundIndex + 1,
        totalRounds: rounds.length,
      };
    } catch (error) {
      console.error('Get question error:', error);
      throw error;
    }
  }

  /**
   * Process student's answer
   */
  async processAnswer(
    sessionId: string,
    questionId: string,
    answerText: string,
    audioBlob?: Buffer
  ) {
    try {
      const session = await prisma.interviewSession.findUnique({
        where: { id: sessionId },
        include: {
          template: true,
          answers: {
            include: {
              question: true,
            },
          },
        },
      });

      if (!session) {
        throw new Error('Session not found');
      }

      const question = await prisma.question.findUnique({
        where: { id: questionId },
      });

      if (!question) {
        throw new Error('Question not found');
      }

      // Evaluate answer using LLM
      const evaluation = await llmService.evaluateAnswer(
        question.text,
        answerText,
        {
          jobRole: session.template.jobRole,
          skills: session.template.skills,
          jobDescription: session.template.jobDescription,
          currentRound: question.category || '',
          previousQA: session.answers.map((a: any) => ({
            question: a.question.text,
            answer: a.answerText,
          })),
        }
      );

      // Store answer and evaluation
      const answer = await prisma.answer.create({
        data: {
          sessionId,
          questionId,
          answerText,
          audioUrl: audioBlob ? 'stored-audio-url' : undefined, // TODO: Implement audio storage
          score: evaluation.score,
          feedback: evaluation.feedback,
          strengths: evaluation.strengths,
          weaknesses: evaluation.weaknesses,
          followUpQuestions: evaluation.followUpQuestion
            ? [{ question: evaluation.followUpQuestion, answer: '' }]
            : [],
          evaluatedAt: new Date(),
        },
      });

      // Update session transcript
      const transcript = session.transcript as any[];
      transcript.push(
        {
          role: 'interviewer',
          text: question.text,
          timestamp: new Date().toISOString(),
        },
        {
          role: 'student',
          text: answerText,
          timestamp: new Date().toISOString(),
        }
      );

      // Move to next question
      await prisma.interviewSession.update({
        where: { id: sessionId },
        data: {
          transcript: transcript as any,
          currentQuestionIndex: session.currentQuestionIndex + 1,
        },
      });

      return {
        evaluation,
        followUpQuestion: evaluation.followUpQuestion,
      };
    } catch (error) {
      console.error('Process answer error:', error);
      throw error;
    }
  }

  /**
   * Complete interview and generate final report
   */
  async completeInterview(sessionId: string) {
    try {
      const session = await prisma.interviewSession.findUnique({
        where: { id: sessionId },
        include: {
          template: true,
          answers: {
            include: {
              question: true,
            },
          },
        },
      });

      if (!session) {
        throw new Error('Session not found');
      }

      // Generate final report
      const report = await llmService.generateFinalReport(
        {
          jobRole: session.template.jobRole,
          skills: session.template.skills,
          jobDescription: session.template.jobDescription,
          currentRound: '',
          previousQA: [],
        },
        session.answers.map(a => ({
          question: a.question.text,
          answer: a.answerText,
          score: a.score || 0,
          feedback: a.feedback || '',
          strengths: a.strengths,
          weaknesses: a.weaknesses,
        }))
      );

      // Update session with final report
      await prisma.interviewSession.update({
        where: { id: sessionId },
        data: {
          status: 'COMPLETED',
          overallScore: report.overallScore,
          finalReport: JSON.stringify(report),
          completedAt: new Date(),
        },
      });

      return report;
    } catch (error) {
      console.error('Complete interview error:', error);
      throw error;
    }
  }

  /**
   * Process audio input from student
   */
  async processAudioInput(audioBlob: Buffer): Promise<string> {
    try {
      const validation = sttService.validateAudio(audioBlob);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      const transcript = await sttService.transcribe(audioBlob);
      return transcript;
    } catch (error) {
      console.error('Audio processing error:', error);
      throw error;
    }
  }

  /**
   * Convert text to speech
   */
  async convertTextToSpeech(text: string): Promise<Buffer> {
    try {
      const audioBuffer = await ttsService.synthesize(text);
      return audioBuffer;
    } catch (error) {
      console.error('TTS error:', error);
      throw error;
    }
  }
}

// Singleton instance
export const interviewService = new InterviewService();
