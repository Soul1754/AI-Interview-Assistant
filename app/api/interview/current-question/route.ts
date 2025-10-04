// app/api/interview/current-question/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { interviewService } from '@/lib/services/interview.service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }

    const currentQuestion = await interviewService.getCurrentQuestion(sessionId);

    if (!currentQuestion) {
      return NextResponse.json(
        { message: 'Interview completed', completed: true },
        { status: 200 }
      );
    }

    return NextResponse.json({ currentQuestion }, { status: 200 });
  } catch (error) {
    console.error('Get question error:', error);
    return NextResponse.json(
      { error: 'Failed to get current question' },
      { status: 500 }
    );
  }
}
