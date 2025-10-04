// app/dashboard/create/page.tsx
'use client';

import React, { useState } from 'react';
import axios from 'axios';

interface Round {
  name: string;
  order: number;
  description: string;
}

export default function CreateTemplatePage() {
  const [formData, setFormData] = useState({
    companyId: '',
    title: '',
    jobRole: '',
    skills: '',
    jobDescription: '',
  });

  const [rounds, setRounds] = useState<Round[]>([
    { name: 'Introduction', order: 1, description: 'Opening round with basic questions' },
    { name: 'Technical', order: 2, description: 'Technical skills assessment' },
    { name: 'HR', order: 3, description: 'Behavioral and cultural fit questions' },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [createdTemplate, setCreatedTemplate] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoundChange = (index: number, field: keyof Round, value: string | number) => {
    const updated = [...rounds];
    updated[index] = { ...updated[index], [field]: value };
    setRounds(updated);
  };

  const addRound = () => {
    setRounds([
      ...rounds,
      { name: '', order: rounds.length + 1, description: '' },
    ]);
  };

  const removeRound = (index: number) => {
    setRounds(rounds.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.companyId || !formData.title || !formData.jobRole || !formData.skills) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setIsCreating(true);

      const response = await axios.post('/api/interview/create-template', {
        companyId: formData.companyId,
        title: formData.title,
        jobRole: formData.jobRole,
        skills: formData.skills.split(',').map(s => s.trim()),
        jobDescription: formData.jobDescription || undefined,
        rounds: rounds.map(r => ({
          name: r.name,
          order: r.order,
          description: r.description || undefined,
        })),
      });

      setCreatedTemplate(response.data.template);
      alert('Interview template created successfully!');
    } catch (error) {
      console.error('Error creating template:', error);
      alert('Failed to create interview template');
    } finally {
      setIsCreating(false);
    }
  };

  if (createdTemplate) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-green-600 mb-6 text-center">
            ✅ Template Created Successfully!
          </h1>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Template Details</h2>
            <p><strong>ID:</strong> {createdTemplate.id}</p>
            <p><strong>Title:</strong> {createdTemplate.title}</p>
            <p><strong>Job Role:</strong> {createdTemplate.jobRole}</p>
            <p><strong>Skills:</strong> {createdTemplate.skills.join(', ')}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Rounds</h2>
            {createdTemplate.rounds.map((round: any) => (
              <div key={round.id} className="mb-4 p-4 bg-gray-50 rounded">
                <h3 className="font-semibold">{round.name}</h3>
                <p className="text-sm text-gray-600">
                  {round.questions?.length || 0} questions generated
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => {
                setCreatedTemplate(null);
                setFormData({
                  companyId: '',
                  title: '',
                  jobRole: '',
                  skills: '',
                  jobDescription: '',
                });
              }}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Create Another Template
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Create Interview Template
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
          {/* Basic Info */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company ID *
                </label>
                <input
                  type="text"
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Senior Software Engineer Interview"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Role *
                </label>
                <input
                  type="text"
                  name="jobRole"
                  value={formData.jobRole}
                  onChange={handleInputChange}
                  placeholder="e.g., Full Stack Developer"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Required Skills * (comma-separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="e.g., React, Node.js, TypeScript, System Design"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description (optional)
                </label>
                <textarea
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Detailed job description..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Rounds */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">Interview Rounds</h2>
              <button
                type="button"
                onClick={addRound}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                + Add Round
              </button>
            </div>

            <div className="space-y-4">
              {rounds.map((round, index) => (
                <div key={index} className="p-4 border border-gray-300 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-700">Round {index + 1}</h3>
                    {rounds.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRound(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      value={round.name}
                      onChange={(e) => handleRoundChange(index, 'name', e.target.value)}
                      placeholder="Round name (e.g., Technical)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                    <textarea
                      value={round.description}
                      onChange={(e) => handleRoundChange(index, 'description', e.target.value)}
                      placeholder="Round description"
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isCreating}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-lg transition"
            >
              {isCreating ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating Template & Generating Questions...
                </span>
              ) : (
                'Create Interview Template'
              )}
            </button>
            <p className="mt-2 text-sm text-gray-600">
              This will generate 6 questions per difficulty (Easy, Medium, Hard) for each round
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
