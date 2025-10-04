// app/page.tsx
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">
            AI Interview Assistant
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the future of interviews with AI-powered voice interaction,
            real-time evaluation, and intelligent feedback
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Company Portal */}
          <Link href="/dashboard/create">
            <div className="bg-white rounded-lg shadow-xl p-8 hover:shadow-2xl transition cursor-pointer">
              <div className="text-5xl mb-4">🏢</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Company Portal
              </h2>
              <p className="text-gray-600 mb-4">
                Create interview templates, generate AI questions, and manage interviews
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>✓ Define interview structure</li>
                <li>✓ AI generates questions</li>
                <li>✓ Real-time evaluation</li>
                <li>✓ Comprehensive reports</li>
              </ul>
            </div>
          </Link>

          {/* Student Portal */}
          <div className="bg-white rounded-lg shadow-xl p-8 hover:shadow-2xl transition">
            <div className="text-5xl mb-4">🎓</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Student Portal
            </h2>
            <p className="text-gray-600 mb-4">
              Join interviews, answer via voice, and receive instant AI feedback
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>✓ Voice-based answering</li>
              <li>✓ Real-time transcription</li>
              <li>✓ Instant feedback</li>
              <li>✓ Full transcript & report</li>
            </ul>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Powered by Advanced AI
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="text-3xl mb-3">🎤</div>
              <h4 className="font-semibold text-lg mb-2">Speech-to-Text</h4>
              <p className="text-gray-600 text-sm">
                Groq Whisper converts your voice to text with high accuracy
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="text-3xl mb-3">🤖</div>
              <h4 className="font-semibold text-lg mb-2">AI Evaluation</h4>
              <p className="text-gray-600 text-sm">
                Gemini 2.5 evaluates answers and provides detailed feedback
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="text-3xl mb-3">🔊</div>
              <h4 className="font-semibold text-lg mb-2">Text-to-Speech</h4>
              <p className="text-gray-600 text-sm">
                Natural voice synthesis for questions and feedback
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
