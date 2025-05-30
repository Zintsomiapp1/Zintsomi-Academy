
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, ArrowLeft, Zap, Target, Clock } from 'lucide-react';
import KhaluluOwl from '@/components/KhaluluOwl';

interface BrainTrainingProps {
  user: { name: string; email: string };
  onBack: () => void;
}

const BrainTraining = ({ user, onBack }: BrainTrainingProps) => {
  const trainingCategories = [
    {
      title: 'Memory Training',
      description: 'Enhance your memory with interactive exercises',
      icon: Brain,
      color: 'bg-blue-500',
      exercises: ['Pattern Memory', 'Word Recall', 'Number Sequences']
    },
    {
      title: 'Focus & Attention',
      description: 'Improve concentration and attention span',
      icon: Target,
      color: 'bg-green-500',
      exercises: ['Attention Grid', 'Focus Flow', 'Distraction Filter']
    },
    {
      title: 'Speed Training',
      description: 'Boost cognitive processing speed',
      icon: Zap,
      color: 'bg-yellow-500',
      exercises: ['Quick Math', 'Rapid Recognition', 'Speed Reading']
    },
    {
      title: 'Reaction Time',
      description: 'Test and improve your reaction speed',
      icon: Clock,
      color: 'bg-purple-500',
      exercises: ['Simple Reaction', 'Choice Reaction', 'Go/No-Go']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="text-center mb-8">
          <KhaluluOwl 
            message={`Welcome to Brain Training, ${user.name}! Let's exercise your mind with fun cognitive challenges.`}
            userName={user.name}
            className="mb-6"
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Brain Training</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Strengthen your cognitive abilities through scientifically designed exercises
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trainingCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${category.color} text-white`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{category.title}</CardTitle>
                      <p className="text-gray-600 text-sm">{category.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {category.exercises.map((exercise, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-sm text-gray-700">{exercise}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full">Start Training</Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BrainTraining;
