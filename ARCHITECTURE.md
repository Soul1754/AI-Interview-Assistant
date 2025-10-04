# AI Interview Assistant - System Architecture

## System Overview

This is a complete full-stack AI-powered interview system with voice interaction capabilities.

## Core Components

### 1. **Speech-to-Text (STT)**
- **Service**: Groq Whisper Large V3
- **Location**: `lib/services/stt.service.ts`
- **Function**: Converts student's voice answers to text
- **Max File Size**: 25MB
- **Supported Formats**: webm, mp3, wav

### 2. **Large Language Model (LLM)**
- **Service**: Google Gemini 2.0 Flash
- **Location**: `lib/services/llm.service.ts`
- **Functions**:
  - Generate interview questions (6 per difficulty level)
  - Evaluate student answers
  - Generate follow-up questions
  - Create final reports
  - Manage conversational dialogue

### 3. **Text-to-Speech (TTS)**
- **Service**: Gemini 2.5 Flash TTS (placeholder for now)
- **Location**: `lib/services/tts.service.ts`
- **Function**: Convert interviewer questions and feedback to audio
- **Note**: Currently using mock implementation; integrate actual TTS API when available

### 4. **Interview Orchestration**
- **Service**: Interview Service
- **Location**: `lib/services/interview.service.ts`
- **Functions**:
  - Create interview templates
  - Generate question pools
  - Manage session state
  - Random question selection
  - Coordinate STT → LLM → TTS pipeline
  - Track conversation history

## Question Management System

### Question Generation
For each interview round:
- **Easy**: 6 questions generated
- **Medium**: 6 questions generated  
- **Hard**: 6 questions generated
- **Total per round**: 18 questions

### Question Selection (Per Session)
From the pool of 18 questions per round:
- **Easy**: 2 randomly selected
- **Medium**: 2 randomly selected
- **Hard**: 2 randomly selected
- **Total per round**: 6 questions asked

### Selection Algorithm
```typescript
// Randomly select N questions of specific difficulty
const selectedQuestions = {
  [roundId]: {
    easy: randomSelect(easyQuestions, 2),
    medium: randomSelect(mediumQuestions, 2),
    hard: randomSelect(hardQuestions, 2)
  }
}
```

## Interview Flow

### Phase 1: Template Creation (Company)
```
1. Company defines job role and skills
2. Company creates interview rounds
3. AI generates 18 questions per round (6 easy, 6 medium, 6 hard)
4. Template saved to database
```

### Phase 2: Session Start
```
1. Student joins interview
2. System randomly selects questions:
   - 2 Easy, 2 Medium, 2 Hard per round
3. Session initialized with selected questions
4. Interview begins
```

### Phase 3: Interview Loop (Per Question)
```
1. Fetch current question from session
2. Convert question text to audio (TTS)
3. Play audio to student
4. Student records voice answer
5. Convert audio to text (STT via Groq Whisper)
6. Submit answer to LLM for evaluation
7. LLM returns:
   - Score (0-10)
   - Detailed feedback
   - Strengths (2-3 points)
   - Weaknesses (2-3 points)
   - Optional follow-up question
8. Display feedback to student
9. Convert feedback to audio (TTS)
10. Play audio feedback
11. Move to next question
12. Repeat until all rounds complete
```

### Phase 4: Completion
```
1. All questions answered
2. LLM generates final report:
   - Overall score (weighted average)
   - Performance summary
   - Detailed feedback
   - Recommendations
3. Report displayed to student
4. Report saved to database
5. Transcript available for download
```

## Database Schema

### Key Tables
- **companies**: Company profiles
- **students**: Student profiles
- **interview_templates**: Job role, skills, rounds config
- **interview_rounds**: Round definitions
- **questions**: Question pool with difficulty levels
- **interview_sessions**: Active/completed interviews
- **answers**: Student responses with evaluations

### Relationships
```
Company → InterviewTemplates → InterviewRounds → Questions
                ↓
          InterviewSessions → Answers
                ↓
             Student
```

## API Endpoints

### Company Endpoints
- `POST /api/interview/create-template` - Create interview template
- `GET /api/interview/templates` - List templates (TODO)

### Interview Endpoints
- `POST /api/interview/start` - Start new session
- `GET /api/interview/current-question` - Get current question
- `POST /api/interview/submit-answer` - Submit answer & get evaluation
- `POST /api/interview/complete` - Complete interview & get report

### Media Processing Endpoints
- `POST /api/interview/transcribe` - Audio → Text (STT)
- `POST /api/interview/synthesize` - Text → Audio (TTS)

## Frontend Architecture

### Pages
- `/` - Home page with role selection
- `/dashboard/create` - Create interview template (Company)
- `/interview/[interviewId]/start` - Active interview interface (Student)

### Components
- `AudioRecorder` - Microphone recording with controls
- `QuestionDisplay` - Show question with progress indicator
- `TranscriptDisplay` - Real-time transcript viewer
- `FeedbackCard` - Evaluation results display

### Hooks
- `useAudioRecorder` - Manage audio recording
- `useInterview` - Interview state management & API calls

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **State**: React Hooks + Zustand (optional)
- **HTTP**: Axios

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma

### AI/ML Services
- **LLM**: Google Gemini 2.0 Flash
- **STT**: Groq Whisper Large V3
- **TTS**: Gemini TTS (to be integrated)

### Infrastructure
- **Hosting**: Vercel / Railway / AWS
- **Database**: Neon / Supabase / RDS
- **Storage**: S3 / Cloudinary (for audio files)

## Modular Architecture

Each service is independently replaceable:

### Replace STT
```typescript
// lib/services/stt.service.ts
export class STTService {
  async transcribe(audio: Blob): Promise<string> {
    // Replace with different provider:
    // - OpenAI Whisper
    // - AWS Transcribe
    // - Azure Speech-to-Text
    // - AssemblyAI
  }
}
```

### Replace LLM
```typescript
// lib/services/llm.service.ts
export class LLMService {
  async generateQuestions(...): Promise<string[]> {
    // Replace with different LLM:
    // - OpenAI GPT-4
    // - Anthropic Claude
    // - Cohere
    // - Local LLM (LLaMA, etc.)
  }
}
```

### Replace TTS
```typescript
// lib/services/tts.service.ts
export class TTSService {
  async synthesize(text: string): Promise<Buffer> {
    // Replace with different TTS:
    // - ElevenLabs
    // - Google Cloud TTS
    // - Azure TTS
    // - AWS Polly
  }
}
```

## Security Considerations

### Implemented
- Environment variable protection
- Input validation on API routes
- File size limits for audio uploads

### TODO
- Add authentication (NextAuth.js)
- Rate limiting on API endpoints
- CORS configuration
- Audio file encryption
- SQL injection protection (Prisma handles this)
- XSS protection (React handles this)

## Performance Optimization

### Current
- Lazy loading of components
- API route optimization
- Database indexing on Prisma schema

### Future Improvements
- Redis caching for session state
- CDN for audio files
- WebSocket for real-time updates
- Batch question generation
- Audio compression

## Scalability

### Horizontal Scaling
- Stateless API design
- Database connection pooling
- Separate audio storage (S3)

### Vertical Scaling
- Optimize LLM prompt lengths
- Batch database operations
- Audio streaming for large files

## Monitoring & Logging

### Implemented
- Console logging for errors
- API error responses

### TODO
- Structured logging (Winston/Pino)
- Error tracking (Sentry)
- Performance monitoring (Datadog/New Relic)
- Interview analytics dashboard
- Question difficulty analytics

## Future Enhancements

### Features
1. **Video Recording**: Add video alongside audio
2. **Screen Sharing**: For coding interviews
3. **Code Editor**: Integrated IDE for technical questions
4. **Whiteboard**: For system design discussions
5. **Multi-language Support**: i18n for global use
6. **Mobile Apps**: iOS and Android versions
7. **Interview Scheduling**: Calendar integration
8. **Email Notifications**: Reports via email
9. **Real-time Collaboration**: Multiple interviewers

### Technical
1. **Microservices**: Split into separate services
2. **GraphQL API**: Alternative to REST
3. **WebRTC**: Peer-to-peer audio
4. **Kubernetes**: Container orchestration
5. **Event-driven**: Use message queues (RabbitMQ/Kafka)

## Development Workflow

### Setup
1. Clone repository
2. Install dependencies: `npm install`
3. Setup `.env` file
4. Run migrations: `npx prisma migrate dev`
5. Start dev server: `npm run dev`

### Testing
1. Unit tests: Jest + React Testing Library
2. E2E tests: Playwright
3. API tests: Supertest

### Deployment
1. Push to GitHub
2. Deploy to Vercel (automatic)
3. Run migrations on production DB
4. Monitor logs and errors

## Cost Estimation (Monthly)

### Development
- Neon Database: Free tier
- Vercel Hosting: Free tier
- Gemini API: ~$5-20 (pay per use)
- Groq API: Free tier / ~$10

### Production (1000 interviews/month)
- Database: ~$10-25
- Hosting: ~$20
- Gemini API: ~$100-200
- Groq API: ~$50
- Total: ~$180-295/month

## Success Metrics

- Interview completion rate
- Average question response time
- Evaluation accuracy (compared to human)
- Student satisfaction score
- System uptime
- API response times

---

Built with ❤️ using modern web technologies and AI
