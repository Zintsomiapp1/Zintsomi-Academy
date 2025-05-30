
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, RotateCcw } from 'lucide-react';

interface ReactionTimeTestProps {
  onBack: () => void;
}

const ReactionTimeTest = ({ onBack }: ReactionTimeTestProps) => {
  const [gameState, setGameState] = useState<'ready' | 'waiting' | 'click' | 'result' | 'tooEarly'>('ready');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [averageTime, setAverageTime] = useState<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const allTimesRef = useRef<number[]>([]);

  const startTest = () => {
    setGameState('waiting');
    const randomDelay = Math.random() * 4000 + 1000; // 1-5 seconds
    
    timeoutRef.current = setTimeout(() => {
      startTimeRef.current = Date.now();
      setGameState('click');
    }, randomDelay);
  };

  const handleClick = () => {
    if (gameState === 'waiting') {
      setGameState('tooEarly');
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setTimeout(() => setGameState('ready'), 2000);
      return;
    }

    if (gameState === 'click') {
      const currentTime = Date.now() - startTimeRef.current;
      setReactionTime(currentTime);
      allTimesRef.current.push(currentTime);
      
      if (!bestTime || currentTime < bestTime) {
        setBestTime(currentTime);
      }
      
      setAttempts(attempts + 1);
      
      const average = allTimesRef.current.reduce((a, b) => a + b, 0) / allTimesRef.current.length;
      setAverageTime(Math.round(average));
      
      setGameState('result');
    }
  };

  const resetGame = () => {
    setGameState('ready');
    setReactionTime(null);
    setBestTime(null);
    setAttempts(0);
    setAverageTime(null);
    allTimesRef.current = [];
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const tryAgain = () => {
    setGameState('ready');
    setReactionTime(null);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getBackgroundColor = () => {
    switch (gameState) {
      case 'waiting':
        return 'bg-red-500';
      case 'click':
        return 'bg-green-500';
      case 'tooEarly':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-100';
    }
  };

  const getMessage = () => {
    switch (gameState) {
      case 'ready':
        return 'Click "Start Test" when ready';
      case 'waiting':
        return 'Wait for GREEN...';
      case 'click':
        return 'CLICK NOW!';
      case 'tooEarly':
        return 'Too early! Wait for green.';
      case 'result':
        return `Your reaction time: ${reactionTime}ms`;
      default:
        return '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Reaction Training
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-center">Reaction Time Test</CardTitle>
          <div className="flex justify-between items-center text-sm">
            <div>Attempts: {attempts}</div>
            {bestTime && <div>Best: {bestTime}ms</div>}
            {averageTime && <div>Average: {averageTime}ms</div>}
            <Button variant="outline" size="sm" onClick={resetGame}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div
              className={`w-full h-64 ${getBackgroundColor()} rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-200 mb-4`}
              onClick={handleClick}
            >
              <p className="text-white text-xl font-bold">
                {getMessage()}
              </p>
            </div>

            {gameState === 'ready' && (
              <Button onClick={startTest} size="lg">
                Start Test
              </Button>
            )}

            {gameState === 'result' && (
              <div className="space-y-2">
                <div className="text-lg">
                  {reactionTime && reactionTime < 200 && (
                    <p className="text-green-600 font-bold">Excellent reflexes! 🎯</p>
                  )}
                  {reactionTime && reactionTime >= 200 && reactionTime < 300 && (
                    <p className="text-blue-600 font-bold">Good reaction time! 👍</p>
                  )}
                  {reactionTime && reactionTime >= 300 && (
                    <p className="text-orange-600 font-bold">Keep practicing! 💪</p>
                  )}
                </div>
                <Button onClick={tryAgain}>
                  Try Again
                </Button>
              </div>
            )}

            <div className="mt-6 text-sm text-gray-600">
              <p>Wait for the red screen to turn green, then click as fast as possible!</p>
              <p className="mt-2">Average human reaction time: 200-300ms</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReactionTimeTest;
