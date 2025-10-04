// app/api/interview/submit-answer/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { interviewService } from '@/lib/services/interview.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { sessionId, questionId, answerText } = body;

    if (!sessionId || !questionId || !answerText) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await interviewService.processAnswer(
      sessionId,
      questionId,
      answerText
    );

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.error('Submit answer error:', error);
    return NextResponse.json(
      { error: 'Failed to submit answer' },
      { status: 500 }
    );
  }
}
