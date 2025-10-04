// app/api/interview/start/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { interviewService } from '@/lib/services/interview.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { templateId, studentId, companyId } = body;

    if (!templateId || !studentId || !companyId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const session = await interviewService.startSession(
      templateId,
      studentId,
      companyId
    );

    return NextResponse.json({ session }, { status: 201 });
  } catch (error) {
    console.error('Start session error:', error);
    return NextResponse.json(
      { error: 'Failed to start interview session' },
      { status: 500 }
    );
  }
}
