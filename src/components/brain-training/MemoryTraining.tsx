
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain } from 'lucide-react';

interface MemoryTrainingProps {
  onBack: () => void;
}

const MemoryTraining = ({ onBack }: MemoryTrainingProps) => {
  const [currentExercise, setCurrentExercise] = useState(0);
  
  const exercises = [
    { name: 'Pattern Memory', description: 'Remember the pattern of highlighted squares' },
    { name: 'Word Recall', description: 'Memorize and recall a list of words' },
    { name: 'Number Sequences', description: 'Remember sequences of numbers' }
  ];

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
              <div className="p-3 rounded-lg bg-blue-500 text-white">
                <Brain className="w-6 h-6" />
              </div>
              Memory Training
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Available Exercises:</h3>
              {exercises.map((exercise, index) => (
                <Card key={index} className="p-4">
                  <h4 className="font-medium">{exercise.name}</h4>
                  <p className="text-gray-600 text-sm">{exercise.description}</p>
                  <Button className="mt-2" size="sm">
                    Start Exercise
                  </Button>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemoryTraining;
