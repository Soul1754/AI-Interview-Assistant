// lib/services/llm.service.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface Message {
  role: 'user' | 'model';
  parts: string;
}

export interface InterviewContext {
  jobRole: string;
  skills: string[];
  jobDescription?: string;
  currentRound: string;
  previousQA: Array<{ question: string; answer: string }>;
}

export class LLMService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  }

  /**
   * Generate interview questions for a specific round and difficulty
   */
  async generateQuestions(
    jobRole: string,
    skills: string[],
    roundName: string,
    difficulty: 'EASY' | 'MEDIUM' | 'HARD',
    count: number = 6,
    jobDescription?: string
  ): Promise<string[]> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

      const prompt = `You are an expert technical interviewer. Generate ${count} ${difficulty} interview questions for the "${roundName}" round.

Job Role: ${jobRole}
Required Skills: ${skills.join(', ')}
${jobDescription ? `Job Description: ${jobDescription}` : ''}

Difficulty Level: ${difficulty}

Requirements:
- Questions should be appropriate for ${difficulty} level
- Focus on ${roundName} aspects of the interview
- Questions should assess the candidate's knowledge of: ${skills.join(', ')}
- Make questions practical and relevant to the job role
- For technical rounds, include coding problems, system design, or concept explanations
- For HR rounds, include behavioral and situational questions

Return ONLY a JSON array of questions, no additional text:
["question 1", "question 2", ...]`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      // Parse JSON response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from LLM');
      }
      
      const questions = JSON.parse(jsonMatch[0]);
      return questions;
    } catch (error) {
      console.error('Question generation error:', error);
      throw new Error(`Failed to generate questions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Evaluate a student's answer to a question
   */
  async evaluateAnswer(
    question: string,
    answer: string,
    context: InterviewContext
  ): Promise<{
    score: number;
    feedback: string;
    strengths: string[];
    weaknesses: string[];
    followUpQuestion?: string;
  }> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

      const prompt = `You are an expert interviewer evaluating a candidate's answer.

Job Role: ${context.jobRole}
Required Skills: ${context.skills.join(', ')}
Current Round: ${context.currentRound}

Question: ${question}
Candidate's Answer: ${answer}

Evaluate the answer and provide:
1. Score (0-10): Rate the answer quality, correctness, and completeness
2. Detailed Feedback: Explain what was good and what could be improved
3. Strengths: List 2-3 specific strengths in the answer
4. Weaknesses: List 2-3 specific areas for improvement
5. Follow-up Question (optional): If the answer needs clarification or depth

Return ONLY valid JSON in this exact format:
{
  "score": 7.5,
  "feedback": "Detailed feedback here...",
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "followUpQuestion": "optional follow-up question"
}`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      // Parse JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid evaluation response format');
      }
      
      const evaluation = JSON.parse(jsonMatch[0]);
      return evaluation;
    } catch (error) {
      console.error('Answer evaluation error:', error);
      throw new Error(`Failed to evaluate answer: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate final interview report
   */
  async generateFinalReport(
    context: InterviewContext,
    answers: Array<{
      question: string;
      answer: string;
      score: number;
      feedback: string;
      strengths: string[];
      weaknesses: string[];
    }>
  ): Promise<{
    overallScore: number;
    summary: string;
    detailedFeedback: string;
    recommendations: string[];
  }> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

      const answersText = answers.map((a, idx) => 
        `Q${idx + 1}: ${a.question}\nA: ${a.answer}\nScore: ${a.score}/10\nFeedback: ${a.feedback}`
      ).join('\n\n');

      const prompt = `You are an expert interviewer creating a final evaluation report.

Job Role: ${context.jobRole}
Required Skills: ${context.skills.join(', ')}

Interview Answers and Evaluations:
${answersText}

Create a comprehensive final report including:
1. Overall Score (0-10): Weighted average considering all answers
2. Summary: Brief overview of the candidate's performance (2-3 sentences)
3. Detailed Feedback: In-depth analysis of strengths and areas for improvement
4. Recommendations: 3-5 specific recommendations for the candidate

Return ONLY valid JSON:
{
  "overallScore": 7.5,
  "summary": "Brief summary...",
  "detailedFeedback": "Detailed analysis...",
  "recommendations": ["recommendation 1", "recommendation 2", ...]
}`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid report response format');
      }
      
      const report = JSON.parse(jsonMatch[0]);
      return report;
    } catch (error) {
      console.error('Report generation error:', error);
      throw new Error(`Failed to generate report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate conversational response during interview
   */
  async generateInterviewerResponse(
    context: InterviewContext,
    studentMessage: string,
    conversationHistory: Message[]
  ): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

      const systemPrompt = `You are a professional interviewer conducting an interview for ${context.jobRole} position.
Current Round: ${context.currentRound}
Required Skills: ${context.skills.join(', ')}

Your role:
- Ask questions naturally and professionally
- Provide clarifications when needed
- Generate follow-up questions based on answers
- Maintain a conversational yet professional tone
- Guide the interview smoothly through different rounds

Respond to the candidate's message appropriately.`;

      const chat = model.startChat({
        history: conversationHistory.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.parts }],
        })),
      });

      const result = await chat.sendMessage([
        { text: systemPrompt },
        { text: studentMessage },
      ]);

      return result.response.text();
    } catch (error) {
      console.error('Conversation error:', error);
      throw new Error(`Failed to generate response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Singleton instance
export const llmService = new LLMService();
