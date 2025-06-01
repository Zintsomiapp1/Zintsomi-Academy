
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, RotateCcw } from 'lucide-react';

interface RapidRecognitionProps {
  onBack: () => void;
}

const RapidRecognition = ({ onBack }: RapidRecognitionProps) => {
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'finished'>('waiting');
  const [currentPattern, setCurrentPattern] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');

  const patterns = [
    { target: '🔴', options: ['🔴', '🔵', '🟢', '🟡'] },
    { target: '⭐', options: ['⭐', '❤️', '🔥', '⚡'] },
    { target: '🔺', options: ['🔺', '🔻', '🔶', '🔷'] },
    { target: '🎯', options: ['🎯', '🎪', '🎨', '🎭'] },
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (gameState === 'playing' && timeLeft === 0) {
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameState]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setRound(1);
    generatePattern();
  };

  const generatePattern = () => {
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    setCurrentPattern(pattern.options.sort(() => Math.random() - 0.5));
    setTimeLeft(5);
    setSelectedAnswer('');
  };

  const handleAnswer = (answer: string) => {
    const correctAnswer = patterns.find(p => 
      p.options.includes(answer) && currentPattern.includes(p.target)
    )?.target;

    if (answer === correctAnswer) {
      setScore(score + 10);
    }

    if (round >= 10) {
      setGameState('finished');
    } else {
      setRound(round + 1);
      generatePattern();
    }
  };

  const handleTimeUp = () => {
    if (round >= 10) {
      setGameState('finished');
    } else {
      setRound(round + 1);
      generatePattern();
    }
  };

  const resetGame = () => {
    setGameState('waiting');
    setScore(0);
    setRound(1);
    setTimeLeft(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Speed Training
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-500 text-white">
                <Eye className="w-6 h-6" />
              </div>
              Rapid Recognition
            </CardTitle>
            <p className="text-gray-600">
              Quickly identify the target pattern among the options
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {gameState === 'waiting' && (
              <div className="text-center space-y-4">
                <p className="text-lg">Ready to test your pattern recognition speed?</p>
                <Button onClick={startGame} size="lg">
                  Start Exercise
                </Button>
              </div>
            )}

            {gameState === 'playing' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>Round: {round}/10</div>
                  <div>Score: {score}</div>
                  <div>Time: {timeLeft}s</div>
                </div>

                <div className="text-center space-y-4">
                  <p className="text-lg font-medium">Find the target pattern:</p>
                  <div className="text-6xl">🎯</div>
                  
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    {currentPattern.map((pattern, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-20 text-4xl"
                        onClick={() => handleAnswer(pattern)}
                      >
                        {pattern}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {gameState === 'finished' && (
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold">Exercise Complete!</h3>
                <p className="text-lg">Final Score: {score}/100</p>
                <p className="text-gray-600">
                  {score >= 80 ? 'Excellent!' : score >= 60 ? 'Good job!' : 'Keep practicing!'}
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={resetGame}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                  <Button variant="outline" onClick={onBack}>
                    Back to Exercises
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RapidRecognition;
