
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, RotateCcw } from 'lucide-react';

interface NumberSequenceProps {
  onBack: () => void;
}

const NumberSequence = ({ onBack }: NumberSequenceProps) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState('');
  const [gameState, setGameState] = useState<'ready' | 'showing' | 'input' | 'result'>('ready');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  const generateSequence = () => {
    const length = Math.min(3 + level, 10);
    const newSequence: number[] = [];
    for (let i = 0; i < length; i++) {
      newSequence.push(Math.floor(Math.random() * 10));
    }
    setSequence(newSequence);
  };

  const startGame = () => {
    generateSequence();
    setGameState('showing');
    setCurrentIndex(0);
    setUserInput('');
  };

  useEffect(() => {
    if (gameState === 'showing' && currentIndex < sequence.length) {
      const timer = setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 800);
      return () => clearTimeout(timer);
    } else if (gameState === 'showing' && currentIndex >= sequence.length) {
      setTimeout(() => {
        setGameState('input');
      }, 500);
    }
  }, [gameState, currentIndex, sequence.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userSequence = userInput.split('').map(Number);
    const isCorrect = userSequence.length === sequence.length && 
                     userSequence.every((num, idx) => num === sequence[idx]);
    
    if (isCorrect) {
      setScore(score + level * 15);
      setLevel(level + 1);
    }
    
    setGameState('result');
    setTimeout(() => {
      setGameState('ready');
    }, 2000);
  };

  const resetGame = () => {
    setLevel(1);
    setScore(0);
    setGameState('ready');
    setSequence([]);
    setUserInput('');
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Memory Training
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-center">Number Sequence</CardTitle>
          <div className="flex justify-between items-center">
            <div>Level: {level}</div>
            <div>Score: {score}</div>
            <Button variant="outline" size="sm" onClick={resetGame}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {gameState === 'ready' && (
            <div className="text-center">
              <p className="mb-4">
                Memorize the sequence of {Math.min(3 + level, 10)} numbers
              </p>
              <Button onClick={startGame}>Start Level {level}</Button>
            </div>
          )}

          {gameState === 'showing' && (
            <div className="text-center">
              <p className="text-blue-600 font-semibold mb-4">
                Memorize this sequence:
              </p>
              <div className="text-6xl font-bold h-20 flex items-center justify-center">
                {currentIndex < sequence.length ? sequence[currentIndex] : ''}
              </div>
              <div className="mt-4 text-sm text-gray-500">
                {currentIndex + 1} / {sequence.length}
              </div>
            </div>
          )}

          {gameState === 'input' && (
            <div className="text-center">
              <p className="text-green-600 font-semibold mb-4">
                Enter the sequence (no spaces):
              </p>
              <form onSubmit={handleSubmit} className="max-w-xs mx-auto">
                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456..."
                  className="text-center text-lg mb-4"
                  maxLength={sequence.length}
                />
                <Button type="submit" className="w-full">
                  Submit Sequence
                </Button>
              </form>
              <div className="mt-2 text-sm text-gray-500">
                Expected length: {sequence.length} digits
              </div>
            </div>
          )}

          {gameState === 'result' && (
            <div className="text-center">
              <div className="mb-4">
                <p className="mb-2">Correct sequence:</p>
                <div className="text-2xl font-bold text-blue-600">
                  {sequence.join('')}
                </div>
              </div>
              <div className="mb-4">
                <p className="mb-2">Your answer:</p>
                <div className="text-2xl font-bold">
                  {userInput}
                </div>
              </div>
              {userInput === sequence.join('') ? (
                <p className="text-green-600 font-bold">Correct! Moving to next level...</p>
              ) : (
                <p className="text-red-600 font-bold">Try again!</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NumberSequence;
