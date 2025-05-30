
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Target } from 'lucide-react';
import AttentionGrid from './exercises/AttentionGrid';

interface FocusTrainingProps {
  onBack: () => void;
}

const FocusTraining = ({ onBack }: FocusTrainingProps) => {
  const [currentExercise, setCurrentExercise] = useState<string | null>(null);

  const exercises = [
    { 
      id: 'attention', 
      name: 'Attention Grid', 
      description: 'Click numbers in sequence to test focus',
      status: 'Available'
    },
    { 
      id: 'focus-flow', 
      name: 'Focus Flow', 
      description: 'Maintain concentration while distractions appear',
      status: 'Coming Soon'
    }
  ];

  if (currentExercise === 'attention') {
    return <AttentionGrid onBack={() => setCurrentExercise(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Brain Training
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-500 text-white">
                <Target className="w-6 h-6" />
              </div>
              Focus & Attention Training
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {exercises.map((exercise) => (
                <Card key={exercise.id} className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-lg">{exercise.name}</h4>
                      <p className="text-gray-600 text-sm">{exercise.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        exercise.status === 'Available' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {exercise.status}
                      </span>
                      <Button 
                        size="sm"
                        disabled={exercise.status !== 'Available'}
                        onClick={() => setCurrentExercise(exercise.id)}
                      >
                        {exercise.status === 'Available' ? 'Start Exercise' : 'Coming Soon'}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FocusTraining;
