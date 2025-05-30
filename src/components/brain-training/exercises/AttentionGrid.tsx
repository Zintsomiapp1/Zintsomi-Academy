
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, RotateCcw } from 'lucide-react';

interface AttentionGridProps {
  onBack: () => void;
}

const AttentionGrid = ({ onBack }: AttentionGridProps) => {
  const [gridSize] = useState(5);
  const [targetNumber, setTargetNumber] = useState(1);
  const [foundNumbers, setFoundNumbers] = useState<number[]>([]);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'complete'>('ready');
  const [startTime, setStartTime] = useState<number>(0);
  const [completionTime, setCompletionTime] = useState<number | null>(null);
  const [grid, setGrid] = useState<number[]>([]);

  const generateGrid = () => {
    const numbers = Array.from({ length: gridSize * gridSize }, (_, i) => i + 1);
    const shuffled = [...numbers].sort(() => Math.random() - 0.5);
    setGrid(shuffled);
  };

  const startGame = () => {
    generateGrid();
    setGameState('playing');
    setTargetNumber(1);
    setFoundNumbers([]);
    setStartTime(Date.now());
    setCompletionTime(null);
  };

  const handleCellClick = (number: number) => {
    if (gameState !== 'playing') return;
    
    if (number === targetNumber) {
      const newFound = [...foundNumbers, number];
      setFoundNumbers(newFound);
      
      if (number === gridSize * gridSize) {
        setGameState('complete');
        setCompletionTime(Date.now() - startTime);
      } else {
        setTargetNumber(number + 1);
      }
    }
  };

  const resetGame = () => {
    setGameState('ready');
    setFoundNumbers([]);
    setTargetNumber(1);
    setCompletionTime(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Focus Training
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-center">Attention Grid</CardTitle>
          <div className="flex justify-between items-center">
            <div>Find: {targetNumber}</div>
            <div>Found: {foundNumbers.length}/{gridSize * gridSize}</div>
            <Button variant="outline" size="sm" onClick={resetGame}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {gameState === 'ready' && (
            <div className="text-center">
              <p className="mb-4">Click numbers in order from 1 to {gridSize * gridSize}</p>
              <Button onClick={startGame}>Start Exercise</Button>
            </div>
          )}

          {(gameState === 'playing' || gameState === 'complete') && (
            <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto">
              {grid.map((number, index) => (
                <button
                  key={index}
                  className={`w-12 h-12 border-2 rounded font-bold ${
                    foundNumbers.includes(number)
                      ? 'bg-green-200 border-green-500'
                      : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                  }`}
                  onClick={() => handleCellClick(number)}
                  disabled={gameState === 'complete'}
                >
                  {number}
                </button>
              ))}
            </div>
          )}

          {gameState === 'complete' && completionTime && (
            <div className="text-center mt-4">
              <p className="text-green-600 font-bold mb-2">Complete!</p>
              <p>Time: {(completionTime / 1000).toFixed(1)}s</p>
              <Button onClick={startGame} className="mt-2">
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttentionGrid;
