
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, ArrowLeft, Zap, Target, Clock } from 'lucide-react';
import KhaluluOwl from '@/components/KhaluluOwl';
import MemoryTraining from '@/components/brain-training/MemoryTraining';
import FocusTraining from '@/components/brain-training/FocusTraining';
import SpeedTraining from '@/components/brain-training/SpeedTraining';
import ReactionTraining from '@/components/brain-training/ReactionTraining';

interface BrainTrainingProps {
  user: { name: string; email: string };
  onBack: () => void;
}

type TrainingType = 'memory' | 'focus' | 'speed' | 'reaction' | null;

const BrainTraining = ({ user, onBack }: BrainTrainingProps) => {
  const [currentTraining, setCurrentTraining] = useState<TrainingType>(null);

  const trainingCategories = [
    {
      id: 'memory' as TrainingType,
      title: 'Memory Training',
      description: 'Enhance your memory with interactive exercises',
      icon: Brain,
      color: 'bg-blue-500',
      exercises: ['Pattern Memory', 'Word Recall', 'Number Sequences']
    },
    {
      id: 'focus' as TrainingType,
      title: 'Focus & Attention',
      description: 'Improve concentration and attention span',
      icon: Target,
      color: 'bg-green-500',
      exercises: ['Attention Grid', 'Focus Flow', 'Distraction Filter']
    },
    {
      id: 'speed' as TrainingType,
      title: 'Speed Training',
      description: 'Boost cognitive processing speed',
      icon: Zap,
      color: 'bg-yellow-500',
      exercises: ['Quick Math', 'Rapid Recognition', 'Speed Reading']
    },
    {
      id: 'reaction' as TrainingType,
      title: 'Reaction Time',
      description: 'Test and improve your reaction speed',
      icon: Clock,
      color: 'bg-purple-500',
      exercises: ['Simple Reaction', 'Choice Reaction', 'Go/No-Go']
    }
  ];

  const handleStartTraining = (trainingType: TrainingType) => {
    setCurrentTraining(trainingType);
  };

  const handleBackToMain = () => {
    setCurrentTraining(null);
  };

  // Render specific training component
  if (currentTraining === 'memory') {
    return <MemoryTraining onBack={handleBackToMain} />;
  }
  if (currentTraining === 'focus') {
    return <FocusTraining onBack={handleBackToMain} />;
  }
  if (currentTraining === 'speed') {
    return <SpeedTraining onBack={handleBackToMain} />;
  }
  if (currentTraining === 'reaction') {
    return <ReactionTraining onBack={handleBackToMain} />;
  }

  // Main brain training page
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
                  <Button 
                    className="w-full"
                    onClick={() => handleStartTraining(category.id)}
                  >
                    Start Training
                  </Button>
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
