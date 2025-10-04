// app/api/interview/synthesize/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { interviewService } from '@/lib/services/interview.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { text } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'Text required' },
        { status: 400 }
      );
    }

    const audioBuffer = await interviewService.convertTextToSpeech(text);

    // Return audio as base64
    const audioBase64 = audioBuffer.toString('base64');

    return NextResponse.json(
      { audio: audioBase64, mimeType: 'audio/mp3' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Synthesize error:', error);
    return NextResponse.json(
      { error: 'Failed to synthesize speech' },
      { status: 500 }
    );
  }
}
