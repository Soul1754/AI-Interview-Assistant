# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment
```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your API keys:
# - Get Gemini API key from: https://makersuite.google.com/app/apikey
# - Get Groq API key from: https://console.groq.com/keys
# - Set DATABASE_URL to your PostgreSQL connection string
```

### Step 3: Setup Database
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init
```

### Step 4: Start Development Server
```bash
npm run dev
```

### Step 5: Open Browser
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🎯 First Interview Template

1. Go to [http://localhost:3000/dashboard/create](http://localhost:3000/dashboard/create)

2. Fill in the form:
   - **Company ID**: `comp_001`
   - **Template Title**: `Full Stack Developer Interview`
   - **Job Role**: `Full Stack Developer`
   - **Skills**: `React, Node.js, TypeScript, PostgreSQL`
   - **Rounds**: Keep default (Introduction, Technical, HR)

3. Click **"Create Interview Template"**

4. Wait for AI to generate questions (1-2 minutes)

5. Note the template ID from the success screen

---

## 🎤 Start an Interview

### Option A: Via API
```bash
curl -X POST http://localhost:3000/api/interview/start \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "YOUR_TEMPLATE_ID",
    "studentId": "student_001",
    "companyId": "comp_001"
  }'
```

### Option B: Direct Link
1. Get session ID from API response
2. Navigate to: `http://localhost:3000/interview/{sessionId}/start`
3. Allow microphone access
4. Start answering questions!

---

## 📝 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Run production build

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open database GUI
npm run prisma:reset     # Reset database

# Utilities
npm run lint             # Run linter
npm run type-check       # Check TypeScript types
npm run setup            # Complete setup (install + migrate)
```

---

## 🔑 Environment Variables

Your `.env` should look like:

```env
# Database (choose one):
# Local PostgreSQL:
DATABASE_URL="postgresql://user:password@localhost:5432/ai_interview"

# Or Neon (free):
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/ai_interview"

# Or Supabase (free):
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"

# API Keys
GEMINI_API_KEY="AIzaSy..."           # Get from Google AI Studio
GROQ_API_KEY="gsk_..."               # Get from Groq Console

# Optional
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

---

## 🧪 Test the System

### 1. Test Question Generation
```bash
# Create template via dashboard
# Check that 18 questions per round are generated
```

### 2. Test Speech-to-Text
```bash
# Start interview
# Record audio answer
# Verify transcription appears
```

### 3. Test Evaluation
```bash
# Submit an answer
# Check that you receive:
#   - Score (0-10)
#   - Feedback
#   - Strengths
#   - Weaknesses
```

### 4. Complete Full Interview
```bash
# Answer all questions in all rounds
# Verify final report is generated
```

---

## 🐛 Troubleshooting

### "Cannot connect to database"
```bash
# Check PostgreSQL is running
pg_isready

# Verify DATABASE_URL in .env is correct
```

### "Module not found" errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### "Prisma Client not initialized"
```bash
# Regenerate Prisma Client
npx prisma generate
```

### Microphone not working
```bash
# Check browser permissions
# Chrome: Settings > Privacy > Microphone
# Make sure localhost is allowed
```

---

## 📱 Browser Compatibility

✅ **Recommended**: Chrome, Edge, Firefox (latest)
⚠️ **Limited**: Safari (microphone support may vary)
❌ **Not supported**: IE11

---

## 🎉 You're All Set!

Your AI Interview Assistant is ready. Start creating templates and conducting interviews!

**Need help?** Check:
- `README.md` - Full documentation
- `SETUP.md` - Detailed setup guide
- `ARCHITECTURE.md` - Technical details
- `PROJECT_SUMMARY.md` - Feature overview

Happy Interviewing! 🎤🤖
