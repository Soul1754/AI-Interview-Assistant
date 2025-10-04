# Setup Instructions

## Quick Start Guide

Follow these steps to get your AI Interview Assistant up and running:

## 1. Install Dependencies

```bash
npm install
```

This will install all required packages:
- Next.js 14
- React 18
- Prisma (PostgreSQL ORM)
- Gemini AI SDK
- Groq SDK
- Axios, Zustand, Zod, etc.

## 2. Setup Database

### Option A: Local PostgreSQL

1. Install PostgreSQL if not already installed:
   ```bash
   # macOS
   brew install postgresql@15
   brew services start postgresql@15
   
   # Ubuntu/Debian
   sudo apt-get install postgresql
   sudo systemctl start postgresql
   ```

2. Create database:
   ```bash
   psql postgres
   CREATE DATABASE ai_interview;
   CREATE USER ai_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE ai_interview TO ai_user;
   \q
   ```

### Option B: Use Cloud Database

Use a cloud PostgreSQL service:
- **Neon**: https://neon.tech (Free tier available)
- **Supabase**: https://supabase.com (Free tier available)
- **Railway**: https://railway.app
- **Heroku Postgres**: https://www.heroku.com/postgres

## 3. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your credentials:
   ```env
   # Database URL
   DATABASE_URL="postgresql://ai_user:your_password@localhost:5432/ai_interview"
   
   # Get Gemini API Key from: https://makersuite.google.com/app/apikey
   GEMINI_API_KEY="your_gemini_api_key_here"
   
   # Get Groq API Key from: https://console.groq.com/keys
   GROQ_API_KEY="your_groq_api_key_here"
   
   # NextAuth (Optional, for authentication)
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="generate_a_random_secret_key"
   ```

### Getting API Keys

#### Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key to your `.env` file

#### Groq API Key
1. Go to [Groq Console](https://console.groq.com/)
2. Sign up or log in
3. Navigate to "API Keys"
4. Create a new key
5. Copy the key to your `.env` file

## 4. Initialize Database with Prisma

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

This will:
- Create all necessary tables
- Set up relationships
- Generate TypeScript types

## 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 6. Create Your First Interview Template

1. Navigate to [http://localhost:3000/dashboard/create](http://localhost:3000/dashboard/create)
2. Fill in the form:
   - **Company ID**: Any unique identifier (e.g., "comp_001")
   - **Template Title**: "Full Stack Developer Interview"
   - **Job Role**: "Full Stack Developer"
   - **Skills**: "React, Node.js, TypeScript, PostgreSQL"
   - **Rounds**: Keep default (Introduction, Technical, HR) or customize
3. Click "Create Interview Template"
4. Wait for AI to generate questions (this may take 1-2 minutes)

## 7. Start an Interview

Once you have a template:

1. Use the API to start a session:
   ```bash
   curl -X POST http://localhost:3000/api/interview/start \
     -H "Content-Type: application/json" \
     -d '{
       "templateId": "your_template_id",
       "studentId": "student_001",
       "companyId": "comp_001"
     }'
   ```

2. Navigate to: `http://localhost:3000/interview/{sessionId}/start`

3. Allow microphone access when prompted

4. Answer questions via voice!

## Troubleshooting

### Database Connection Issues

If you get connection errors:
```bash
# Check if PostgreSQL is running
pg_isready

# Check your DATABASE_URL in .env
# Make sure username, password, host, and database name are correct
```

### TypeScript Errors

The lint errors you see are expected until you run:
```bash
npm install
```

This will install all type definitions and resolve import errors.

### API Key Issues

- **Gemini**: Make sure you've enabled the Generative Language API in Google Cloud Console
- **Groq**: Ensure you have credits available in your account

### Port Already in Use

If port 3000 is taken:
```bash
# Run on different port
PORT=3001 npm run dev
```

## Production Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy!

### Deploy to Other Platforms

- **Railway**: https://railway.app
- **Render**: https://render.com
- **AWS**: Use EC2 + RDS
- **Google Cloud**: App Engine + Cloud SQL

## Additional Commands

```bash
# Reset database
npx prisma migrate reset

# View database in browser
npx prisma studio

# Build for production
npm run build

# Run production build
npm start

# Run linting
npm run lint
```

## Testing the System

### 1. Test STT (Speech-to-Text)
Record a short audio and upload via `/api/interview/transcribe`

### 2. Test LLM (Question Generation)
Create a template and verify questions are generated

### 3. Test TTS (Text-to-Speech)
Submit text to `/api/interview/synthesize`

### 4. Full Interview Flow
Complete an entire interview session from start to finish

## Next Steps

1. **Authentication**: Add NextAuth.js for user authentication
2. **File Storage**: Integrate AWS S3 or Cloudinary for audio storage
3. **Real TTS**: Replace mock TTS with actual Gemini TTS when available
4. **Analytics**: Add interview analytics dashboard
5. **Email Notifications**: Send reports via email
6. **Mobile App**: Create React Native version

## Support

- Check README.md for detailed documentation
- Review code comments for implementation details
- File issues on GitHub for bugs

Happy Interviewing! 🎤🤖
