// app/api/interview/complete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { interviewService } from '@/lib/services/interview.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }

    const report = await interviewService.completeInterview(sessionId);

    return NextResponse.json({ report }, { status: 200 });
  } catch (error) {
    console.error('Complete interview error:', error);
    return NextResponse.json(
      { error: 'Failed to complete interview' },
      { status: 500 }
    );
  }
}
