
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Target } from 'lucide-react';

interface FocusTrainingProps {
  onBack: () => void;
}

const FocusTraining = ({ onBack }: FocusTrainingProps) => {
  const exercises = [
    { name: 'Attention Grid', description: 'Focus on specific elements in a grid' },
    { name: 'Focus Flow', description: 'Maintain concentration while distractions appear' },
    { name: 'Distraction Filter', description: 'Filter out irrelevant information' }
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
              <div className="p-3 rounded-lg bg-green-500 text-white">
                <Target className="w-6 h-6" />
              </div>
              Focus & Attention Training
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

export default FocusTraining;
