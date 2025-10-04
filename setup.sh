#!/bin/bash

# AI Interview Assistant - Setup Script
# This script automates the setup process

echo "🚀 AI Interview Assistant Setup"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm $(npm --version) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚙️  Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env file with your API keys:"
    echo "   - DATABASE_URL: Your PostgreSQL connection string"
    echo "   - GEMINI_API_KEY: Get from https://makersuite.google.com/app/apikey"
    echo "   - GROQ_API_KEY: Get from https://console.groq.com/keys"
    echo ""
    read -p "Press Enter after you've updated the .env file..."
else
    echo "✅ .env file already exists"
fi

echo ""

# Check if DATABASE_URL is set
if ! grep -q "DATABASE_URL=\"postgresql://" .env; then
    echo "⚠️  DATABASE_URL not configured in .env"
    echo "Please set your PostgreSQL connection string in .env"
    exit 1
fi

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma Client"
    exit 1
fi

echo "✅ Prisma Client generated"
echo ""

# Run database migrations
echo "🗄️  Running database migrations..."
npx prisma migrate dev --name init

if [ $? -ne 0 ]; then
    echo "❌ Failed to run migrations"
    echo "Please check your DATABASE_URL in .env"
    exit 1
fi

echo "✅ Database migrations completed"
echo ""

# Setup complete
echo "🎉 Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Run development server: npm run dev"
echo "2. Open http://localhost:3000"
echo "3. Create an interview template at /dashboard/create"
echo "4. Start interviewing!"
echo ""
echo "Need help? Check:"
echo "- README.md for overview"
echo "- SETUP.md for detailed instructions"
echo "- ARCHITECTURE.md for technical details"
echo ""
echo "Happy interviewing! 🎤"
