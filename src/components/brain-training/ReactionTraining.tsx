
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock } from 'lucide-react';
import ReactionTimeTest from './exercises/ReactionTimeTest';
import ChoiceReaction from './exercises/ChoiceReaction';
import GoNoGo from './exercises/GoNoGo';

interface ReactionTrainingProps {
  onBack: () => void;
}

const ReactionTraining = ({ onBack }: ReactionTrainingProps) => {
  const [currentExercise, setCurrentExercise] = useState<string | null>(null);

  const exercises = [
    { 
      id: 'simple', 
      name: 'Simple Reaction', 
      description: 'React as quickly as possible to a green signal',
      status: 'Available'
    },
    { 
      id: 'choice', 
      name: 'Choice Reaction', 
      description: 'Choose the correct response from multiple options',
      status: 'Available'
    },
    { 
      id: 'go-no-go', 
      name: 'Go/No-Go', 
      description: 'Decide whether to react or withhold response',
      status: 'Available'
    }
  ];

  if (currentExercise === 'simple') {
    return <ReactionTimeTest onBack={() => setCurrentExercise(null)} />;
  }

  if (currentExercise === 'choice') {
    return <ChoiceReaction onBack={() => setCurrentExercise(null)} />;
  }

  if (currentExercise === 'go-no-go') {
    return <GoNoGo onBack={() => setCurrentExercise(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 sm:mb-6 text-gray-600 hover:text-gray-900 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Brain Training
        </Button>

        <Card className="shadow-lg">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
              <div className="p-2 sm:p-3 rounded-lg bg-purple-500 text-white">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              Reaction Time Training
            </CardTitle>
            <p className="text-gray-600 text-sm sm:text-base mt-2">
              Test and improve your reaction speed with various challenges
            </p>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              {exercises.map((exercise) => (
                <Card key={exercise.id} className="p-3 sm:p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-base sm:text-lg">{exercise.name}</h4>
                      <p className="text-gray-600 text-xs sm:text-sm mt-1">{exercise.description}</p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-2">
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
                        className="min-h-[36px] text-xs sm:text-sm"
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

export default ReactionTraining;
