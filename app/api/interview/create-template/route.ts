// app/api/interview/create-template/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { interviewService } from '@/lib/services/interview.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { companyId, title, jobRole, skills, jobDescription, rounds } = body;

    if (!companyId || !title || !jobRole || !skills || !rounds) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const template = await interviewService.createInterviewTemplate(companyId, {
      title,
      jobRole,
      skills,
      jobDescription,
      rounds,
    });

    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    console.error('Create template error:', error);
    return NextResponse.json(
      { error: 'Failed to create interview template' },
      { status: 500 }
    );
  }
}
