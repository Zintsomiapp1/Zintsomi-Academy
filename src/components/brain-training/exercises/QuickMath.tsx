
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, RotateCcw } from 'lucide-react';

interface QuickMathProps {
  onBack: () => void;
}

const QuickMath = ({ onBack }: QuickMathProps) => {
  const [currentProblem, setCurrentProblem] = useState({ num1: 0, num2: 0, operator: '+', answer: 0 });
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'finished'>('ready');
  const [streak, setStreak] = useState(0);

  const operators = ['+', '-', '×'];

  const generateProblem = () => {
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    const operator = operators[Math.floor(Math.random() * operators.length)];
    
    let answer;
    switch (operator) {
      case '+':
        answer = num1 + num2;
        break;
      case '-':
        answer = Math.max(num1, num2) - Math.min(num1, num2);
        break;
      case '×':
        answer = num1 * num2;
        break;
      default:
        answer = num1 + num2;
    }
    
    setCurrentProblem({ 
      num1: operator === '-' ? Math.max(num1, num2) : num1, 
      num2: operator === '-' ? Math.min(num1, num2) : num2, 
      operator, 
      answer 
    });
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setStreak(0);
    setTimeLeft(60);
    setUserAnswer('');
    generateProblem();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const answer = parseInt(userAnswer);
    
    if (answer === currentProblem.answer) {
      setScore(score + 1 + streak);
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }
    
    setUserAnswer('');
    generateProblem();
  };

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameState('finished');
    }
  }, [gameState, timeLeft]);

  const resetGame = () => {
    setGameState('ready');
    setScore(0);
    setStreak(0);
    setTimeLeft(60);
    setUserAnswer('');
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Speed Training
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-center">Quick Math</CardTitle>
          <div className="flex justify-between items-center">
            <div>Score: {score}</div>
            <div>Time: {timeLeft}s</div>
            <div>Streak: {streak}</div>
            <Button variant="outline" size="sm" onClick={resetGame}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {gameState === 'ready' && (
            <div className="text-center">
              <p className="mb-4">Solve as many math problems as possible in 60 seconds!</p>
              <Button onClick={startGame}>Start Exercise</Button>
            </div>
          )}

          {gameState === 'playing' && (
            <div className="text-center">
              <div className="text-4xl font-bold mb-6">
                {currentProblem.num1} {currentProblem.operator} {currentProblem.num2} = ?
              </div>
              <form onSubmit={handleSubmit} className="max-w-xs mx-auto">
                <Input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Answer"
                  className="text-center text-xl mb-4"
                  autoFocus
                />
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </form>
            </div>
          )}

          {gameState === 'finished' && (
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Time's Up!</h3>
              <p className="text-xl mb-2">Final Score: {score}</p>
              <p className="text-gray-600 mb-4">
                {score >= 30 ? 'Excellent!' : score >= 20 ? 'Good job!' : 'Keep practicing!'}
              </p>
              <Button onClick={startGame}>Play Again</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickMath;
