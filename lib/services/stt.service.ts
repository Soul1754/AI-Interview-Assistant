// lib/services/stt.service.ts
import Groq from 'groq-sdk';

export class STTService {
  private groq: Groq;

  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  /**
   * Convert audio to text using Groq Whisper
   * @param audioBlob Audio file as Blob or Buffer
   * @param filename Original filename
   * @returns Transcribed text
   */
  async transcribe(audioBlob: Blob | Buffer, filename: string = 'audio.webm'): Promise<string> {
    try {
      // Create File object from Blob/Buffer
      const file = audioBlob instanceof Buffer 
        ? new File([audioBlob], filename, { type: 'audio/webm' })
        : audioBlob instanceof Blob 
        ? new File([audioBlob], filename, { type: audioBlob.type })
        : audioBlob;

      const transcription = await this.groq.audio.transcriptions.create({
        file: file,
        model: 'whisper-large-v3',
        language: 'en',
        response_format: 'json',
        temperature: 0.0,
      });

      return transcription.text;
    } catch (error) {
      console.error('STT Error:', error);
      throw new Error(`Speech-to-text failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate audio format and size
   */
  validateAudio(audioBlob: Blob | Buffer): { valid: boolean; error?: string } {
    const maxSize = 25 * 1024 * 1024; // 25MB limit
    
    if (audioBlob instanceof Buffer) {
      if (audioBlob.length > maxSize) {
        return { valid: false, error: 'Audio file too large (max 25MB)' };
      }
    } else if (audioBlob instanceof Blob) {
      if (audioBlob.size > maxSize) {
        return { valid: false, error: 'Audio file too large (max 25MB)' };
      }
    }

    return { valid: true };
  }
}

// Singleton instance
export const sttService = new STTService();
