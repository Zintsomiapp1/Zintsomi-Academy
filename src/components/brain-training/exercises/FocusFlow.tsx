
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Target, RotateCcw } from 'lucide-react';

interface FocusFlowProps {
  onBack: () => void;
}

const FocusFlow = ({ onBack }: FocusFlowProps) => {
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'finished'>('waiting');
  const [targetNumber, setTargetNumber] = useState(1);
  const [distractors, setDistractors] = useState<{ id: number; x: number; y: number }[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [clickedTarget, setClickedTarget] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (gameState === 'playing' && timeLeft === 0) {
      setGameState('finished');
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameState]);

  useEffect(() => {
    if (gameState === 'playing') {
      const interval = setInterval(() => {
        generateDistractors();
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [gameState]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTargetNumber(1);
    setTimeLeft(60);
    setClickedTarget(false);
    generateDistractors();
  };

  const generateDistractors = () => {
    const newDistractors = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
    }));
    setDistractors(newDistractors);
  };

  const handleTargetClick = () => {
    if (!clickedTarget) {
      setScore(score + 10);
      setTargetNumber(targetNumber + 1);
      setClickedTarget(true);
      setTimeout(() => setClickedTarget(false), 1000);
    }
  };

  const resetGame = () => {
    setGameState('waiting');
    setScore(0);
    setTargetNumber(1);
    setTimeLeft(0);
    setDistractors([]);
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
          Back to Focus Training
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-500 text-white">
                <Target className="w-6 h-6" />
              </div>
              Focus Flow
            </CardTitle>
            <p className="text-gray-600">
              Stay focused on the target while distractions appear around you
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {gameState === 'waiting' && (
              <div className="text-center space-y-4">
                <p className="text-lg">Ready to test your focus against distractions?</p>
                <Button onClick={startGame} size="lg">
                  Start Exercise
                </Button>
              </div>
            )}

            {gameState === 'playing' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>Target: {targetNumber}</div>
                  <div>Score: {score}</div>
                  <div>Time: {timeLeft}s</div>
                </div>

                <div className="relative bg-gray-100 rounded-lg h-96 overflow-hidden">
                  {/* Target */}
                  <div
                    className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full ${
                      clickedTarget ? 'bg-green-500' : 'bg-blue-500'
                    } flex items-center justify-center text-white font-bold text-xl cursor-pointer transition-colors`}
                    onClick={handleTargetClick}
                  >
                    {targetNumber}
                  </div>

                  {/* Distractors */}
                  {distractors.map((distractor) => (
                    <div
                      key={distractor.id}
                      className="absolute w-12 h-12 rounded-full bg-red-400 animate-pulse"
                      style={{
                        left: `${distractor.x}%`,
                        top: `${distractor.y}%`,
                      }}
                    />
                  ))}
                </div>

                <p className="text-center text-sm text-gray-600">
                  Click the blue target to increase your score. Ignore the red distractors!
                </p>
              </div>
            )}

            {gameState === 'finished' && (
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold">Exercise Complete!</h3>
                <p className="text-lg">Final Score: {score}</p>
                <p className="text-gray-600">
                  Target reached: {targetNumber - 1}
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

export default FocusFlow;
