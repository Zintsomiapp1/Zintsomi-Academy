
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain } from 'lucide-react';
import PatternMemory from './exercises/PatternMemory';
import WordRecall from './exercises/WordRecall';
import NumberSequence from './exercises/NumberSequence';

interface MemoryTrainingProps {
  onBack: () => void;
}

type ExerciseType = 'pattern' | 'words' | 'numbers' | null;

const MemoryTraining = ({ onBack }: MemoryTrainingProps) => {
  const [currentExercise, setCurrentExercise] = useState<ExerciseType>(null);
  
  const exercises = [
    { 
      id: 'pattern' as ExerciseType, 
      name: 'Pattern Memory', 
      description: 'Remember the pattern of highlighted squares',
      difficulty: 'Easy to Hard'
    },
    { 
      id: 'words' as ExerciseType, 
      name: 'Word Recall', 
      description: 'Memorize and recall a list of words',
      difficulty: 'Medium'
    },
    { 
      id: 'numbers' as ExerciseType, 
      name: 'Number Sequences', 
      description: 'Remember sequences of numbers',
      difficulty: 'Hard'
    }
  ];

  const handleStartExercise = (exerciseId: ExerciseType) => {
    setCurrentExercise(exerciseId);
  };

  const handleBackToMenu = () => {
    setCurrentExercise(null);
  };

  // Render specific exercise
  if (currentExercise === 'pattern') {
    return <PatternMemory onBack={handleBackToMenu} />;
  }
  if (currentExercise === 'words') {
    return <WordRecall onBack={handleBackToMenu} />;
  }
  if (currentExercise === 'numbers') {
    return <NumberSequence onBack={handleBackToMenu} />;
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
              <div className="p-3 rounded-lg bg-blue-500 text-white">
                <Brain className="w-6 h-6" />
              </div>
              Memory Training
            </CardTitle>
            <p className="text-gray-600">
              Challenge your memory with interactive exercises that get progressively harder
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-1">
              {exercises.map((exercise) => (
                <Card key={exercise.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{exercise.name}</h4>
                      <p className="text-gray-600 text-sm mb-2">{exercise.description}</p>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {exercise.difficulty}
                      </span>
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-3" 
                    onClick={() => handleStartExercise(exercise.id)}
                  >
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
