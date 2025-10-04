# AI Interview Assistant

A full-stack AI-powered interview system with voice interaction, featuring real-time speech-to-text, intelligent evaluation, and text-to-speech capabilities.

## 🎯 Features

### Company Role (AI Interviewer)
- **Template Creation**: Define interview structure (Introduction, Technical, HR rounds)
- **Question Generation**: AI generates 6 questions per difficulty level (Easy, Medium, Hard) using Gemini-2.5
- **Smart Selection**: Randomly selects 2 questions per difficulty per round for each interview
- **Real-time Evaluation**: Per-question scoring and detailed feedback
- **Voice Interaction**: All responses converted to speech using Gemini TTS
- **Final Report**: Comprehensive evaluation with scores, strengths, and recommendations

### Student Role (Interviewee)
- **Voice Input**: Answer questions via microphone
- **Real-time Transcription**: Groq Whisper STT converts audio to text
- **AI Dialogue**: Natural conversation flow with follow-up questions
- **Instant Feedback**: Receive evaluation after each answer
- **Full Transcript**: Complete interview history with audio playback

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                        │
│  ┌────────────┐  ┌─────────────┐  ┌──────────────┐            │
│  │ Audio      │  │ Question    │  │  Feedback    │            │
│  │ Recorder   │  │ Display     │  │  Display     │            │
│  └────────────┘  └─────────────┘  └──────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Routes (Next.js)                        │
│  /api/interview/create-template                                 │
│  /api/interview/start                                           │
│  /api/interview/current-question                                │
│  /api/interview/submit-answer                                   │
│  /api/interview/transcribe (STT)                                │
│  /api/interview/synthesize (TTS)                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Service Layer                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ STT Service  │  │ LLM Service  │  │ TTS Service  │         │
│  │ (Groq        │  │ (Gemini 2.5) │  │ (Gemini TTS) │         │
│  │  Whisper)    │  │              │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────────────────────────────────────────┐          │
│  │         Interview Orchestration Service           │          │
│  │  • Question selection & management                │          │
│  │  • Answer evaluation                              │          │
│  │  • Session state tracking                         │          │
│  │  • Report generation                              │          │
│  └──────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Database (PostgreSQL + Prisma)                │
│  • Companies & Students                                          │
│  • Interview Templates & Rounds                                  │
│  • Questions (6 per difficulty per round)                        │
│  • Sessions & Answers                                            │
│  • Evaluations & Reports                                         │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- API Keys:
  - Gemini API Key (Google AI)
  - Groq API Key

### Installation

1. **Clone the repository**
   ```bash
   cd "AI Interview Assistant"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/ai_interview"
   GEMINI_API_KEY="your_gemini_api_key"
   GROQ_API_KEY="your_groq_api_key"
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

### Key Models

- **InterviewTemplate**: Job role, skills, rounds configuration
- **InterviewRound**: Round name, order, description
- **Question**: Question text, difficulty (EASY/MEDIUM/HARD), category
- **InterviewSession**: Active interview state, selected questions, transcript
- **Answer**: Student responses, evaluations, scores, feedback

## 🎤 Interview Flow

### 1. Company Creates Template
```typescript
POST /api/interview/create-template
{
  "companyId": "comp_123",
  "title": "Senior Developer Interview",
  "jobRole": "Full Stack Developer",
  "skills": ["React", "Node.js", "TypeScript"],
  "rounds": [
    { "name": "Introduction", "order": 1 },
    { "name": "Technical", "order": 2 },
    { "name": "HR", "order": 3 }
  ]
}
```
**System generates 18 questions per round** (6 Easy + 6 Medium + 6 Hard)

### 2. Start Interview Session
```typescript
POST /api/interview/start
{
  "templateId": "tmpl_123",
  "studentId": "std_456",
  "companyId": "comp_123"
}
```
**System randomly selects 2 questions per difficulty** (6 total per round)

### 3. Interview Loop
For each question:
1. **Fetch Question**: `GET /api/interview/current-question?sessionId=xxx`
2. **Play Audio**: System converts question to speech
3. **Record Answer**: Student speaks into microphone
4. **Transcribe**: `POST /api/interview/transcribe` (Groq Whisper)
5. **Evaluate**: `POST /api/interview/submit-answer` (Gemini LLM)
6. **Show Feedback**: Display score, strengths, weaknesses
7. **Next Question**: Repeat until all rounds complete

### 4. Generate Final Report
```typescript
POST /api/interview/complete
{
  "sessionId": "sess_789"
}
```
Returns comprehensive report with:
- Overall score (weighted average)
- Performance summary
- Detailed feedback
- Recommendations

## 🧩 Component Structure

### Frontend Components

```
app/
├── components/
│   └── ui/
│       ├── AudioRecorder.tsx      # Microphone recording
│       ├── QuestionDisplay.tsx    # Show question with progress
│       ├── TranscriptDisplay.tsx  # Real-time transcript
│       └── FeedbackCard.tsx       # Evaluation results
├── interview/
│   └── [interviewId]/
│       └── start/
│           └── page.tsx           # Main interview interface
└── dashboard/
    └── create/
        └── page.tsx               # Template creation
```

### Hooks

- **useAudioRecorder**: Manage microphone recording
- **useInterview**: Interview state management, API calls

### Services

- **sttService**: Groq Whisper transcription
- **llmService**: Gemini question generation, evaluation, reports
- **ttsService**: Gemini text-to-speech
- **interviewService**: Orchestration, question selection, session management

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/interview/create-template` | POST | Create interview template |
| `/api/interview/start` | POST | Start new interview session |
| `/api/interview/current-question` | GET | Get current question |
| `/api/interview/submit-answer` | POST | Submit answer & get evaluation |
| `/api/interview/complete` | POST | Complete interview & get report |
| `/api/interview/transcribe` | POST | Convert audio to text (STT) |
| `/api/interview/synthesize` | POST | Convert text to audio (TTS) |

## 🎯 Question Difficulty System

Each round has **18 pre-generated questions**:
- 6 Easy questions
- 6 Medium questions  
- 6 Hard questions

For each interview session:
- **2 Easy** questions are randomly selected
- **2 Medium** questions are randomly selected
- **2 Hard** questions are randomly selected
- Total: **6 questions per round**

## 🔐 Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ai_interview

# AI Services
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key

# Optional: NextAuth (for authentication)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
```

## 📦 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **AI/ML**:
  - Gemini 2.5 (Question generation, evaluation, dialogue)
  - Gemini TTS (Text-to-speech)
  - Groq Whisper (Speech-to-text)
- **Audio**: Web Audio API, MediaRecorder API

## 🛠️ Development

### Run Prisma Studio
```bash
npx prisma studio
```

### Reset Database
```bash
npx prisma migrate reset
```

### Generate Prisma Client
```bash
npx prisma generate
```

### Run Tests
```bash
npm test
```

## 📝 Example Usage

### Create Interview Template (Company)
```typescript
const template = await fetch('/api/interview/create-template', {
  method: 'POST',
  body: JSON.stringify({
    companyId: 'comp_123',
    title: 'Full Stack Developer Interview',
    jobRole: 'Full Stack Developer',
    skills: ['React', 'Node.js', 'PostgreSQL', 'System Design'],
    rounds: [
      { name: 'Introduction', order: 1 },
      { name: 'Technical', order: 2 },
      { name: 'HR', order: 3 }
    ]
  })
});
// Generates 54 total questions (18 per round)
```

### Start Interview (Student)
```typescript
const session = await fetch('/api/interview/start', {
  method: 'POST',
  body: JSON.stringify({
    templateId: 'tmpl_123',
    studentId: 'std_456',
    companyId: 'comp_123'
  })
});
// Selects 18 questions (6 per round, 2 per difficulty)
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Google Gemini API for LLM capabilities
- Groq for fast Whisper transcription
- Next.js team for the amazing framework
- Prisma for the excellent ORM

## 📞 Support

For questions or issues, please open an issue on GitHub.

---

Built with ❤️ using Next.js, Gemini, and Groq
