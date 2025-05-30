
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, RotateCcw } from 'lucide-react';

interface PatternMemoryProps {
  onBack: () => void;
}

const PatternMemory = ({ onBack }: PatternMemoryProps) => {
  const [gridSize] = useState(4);
  const [pattern, setPattern] = useState<number[]>([]);
  const [currentPattern, setCurrentPattern] = useState<number[]>([]);
  const [showPattern, setShowPattern] = useState(false);
  const [gameState, setGameState] = useState<'ready' | 'showing' | 'input' | 'correct' | 'wrong'>('ready');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);

  const generatePattern = () => {
    const patternLength = Math.min(3 + level, 8);
    const newPattern: number[] = [];
    const usedIndices = new Set<number>();
    
    // Generate unique indices for the pattern
    while (newPattern.length < patternLength) {
      const randomIndex = Math.floor(Math.random() * (gridSize * gridSize));
      if (!usedIndices.has(randomIndex)) {
        newPattern.push(randomIndex);
        usedIndices.add(randomIndex);
      }
    }
    
    console.log('Generated pattern:', newPattern);
    setPattern(newPattern);
    setCurrentPattern([]);
  };

  const startGame = () => {
    generatePattern();
    setGameState('showing');
    setShowPattern(true);
    
    setTimeout(() => {
      setShowPattern(false);
      setGameState('input');
    }, 2000 + (level * 500));
  };

  const handleCellClick = (index: number) => {
    if (gameState !== 'input') return;

    const newCurrentPattern = [...currentPattern, index];
    setCurrentPattern(newCurrentPattern);
    
    console.log('Current pattern so far:', newCurrentPattern);
    console.log('Target pattern:', pattern);

    // Check if the current click is correct so far
    const isCorrectSoFar = newCurrentPattern.every((clickedIndex, idx) => 
      clickedIndex === pattern[idx]
    );

    if (!isCorrectSoFar) {
      // Wrong click - end game immediately
      setGameState('wrong');
      console.log('Wrong pattern detected');
      setTimeout(() => {
        setGameState('ready');
      }, 2000);
      return;
    }

    // If we've completed the pattern and all clicks were correct
    if (newCurrentPattern.length === pattern.length) {
      setGameState('correct');
      setScore(score + level * 10);
      console.log('Pattern completed correctly!');
      setTimeout(() => {
        setLevel(level + 1);
        setGameState('ready');
      }, 1500);
    }
  };

  const resetGame = () => {
    setLevel(1);
    setScore(0);
    setGameState('ready');
    setCurrentPattern([]);
    setPattern([]);
  };

  const getCellClass = (index: number) => {
    let baseClass = "w-16 h-16 border-2 border-gray-300 rounded-lg transition-all duration-200 cursor-pointer ";
    
    if (showPattern && pattern.includes(index)) {
      baseClass += "bg-blue-500 ";
    } else if (currentPattern.includes(index)) {
      baseClass += "bg-green-400 ";
    } else {
      baseClass += "bg-gray-100 hover:bg-gray-200 ";
    }
    
    return baseClass;
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
          <CardTitle className="text-center">Pattern Memory</CardTitle>
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
          <div className="text-center mb-4">
            {gameState === 'ready' && (
              <div>
                <p className="mb-4">Memorize the pattern of highlighted squares, then click them in the SAME ORDER</p>
                <Button onClick={startGame}>Start Level {level}</Button>
              </div>
            )}
            {gameState === 'showing' && (
              <p className="text-blue-600 font-semibold">Memorize this pattern!</p>
            )}
            {gameState === 'input' && (
              <p className="text-green-600 font-semibold">Click the squares in the same order they were shown</p>
            )}
            {gameState === 'correct' && (
              <p className="text-green-600 font-bold">Correct! Well done!</p>
            )}
            {gameState === 'wrong' && (
              <p className="text-red-600 font-bold">Wrong pattern. Try again!</p>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2 justify-center max-w-xs mx-auto">
            {Array.from({ length: gridSize * gridSize }, (_, index) => (
              <button
                key={index}
                className={getCellClass(index)}
                onClick={() => handleCellClick(index)}
                disabled={gameState !== 'input'}
              />
            ))}
          </div>

          {gameState === 'input' && (
            <div className="mt-4 text-center text-sm text-gray-600">
              Progress: {currentPattern.length} / {pattern.length}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatternMemory;
