
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const SudokuGame = () => {
  const [grid, setGrid] = useState<(number | null)[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const { toast } = useToast();

  // Generate a simple sudoku puzzle
  const generatePuzzle = (difficulty: 'easy' | 'medium' | 'hard') => {
    const newGrid: (number | null)[][] = Array(9).fill(null).map(() => Array(9).fill(null));
    
    // Fill some cells with valid numbers for demo
    const cellsToFill = difficulty === 'easy' ? 45 : difficulty === 'medium' ? 35 : 25;
    
    for (let i = 0; i < cellsToFill; i++) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      const num = Math.floor(Math.random() * 9) + 1;
      
      if (newGrid[row][col] === null && isValidMove(newGrid, row, col, num)) {
        newGrid[row][col] = num;
      }
    }
    
    setGrid(newGrid);
  };

  const isValidMove = (grid: (number | null)[][], row: number, col: number, num: number): boolean => {
    // Check row
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === num) return false;
    }
    
    // Check column
    for (let i = 0; i < 9; i++) {
      if (grid[i][col] === num) return false;
    }
    
    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = boxRow; i < boxRow + 3; i++) {
      for (let j = boxCol; j < boxCol + 3; j++) {
        if (grid[i][j] === num) return false;
      }
    }
    
    return true;
  };

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col });
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell) return;
    
    const newGrid = [...grid];
    const { row, col } = selectedCell;
    
    if (isValidMove(newGrid, row, col, num)) {
      newGrid[row][col] = num;
      setGrid(newGrid);
      toast({
        title: "Valid move!",
        description: `Placed ${num} at row ${row + 1}, column ${col + 1}`,
      });
    } else {
      toast({
        title: "Invalid move",
        description: "This number violates Sudoku rules",
        variant: "destructive"
      });
    }
  };

  const clearCell = () => {
    if (!selectedCell) return;
    
    const newGrid = [...grid];
    newGrid[selectedCell.row][selectedCell.col] = null;
    setGrid(newGrid);
  };

  useEffect(() => {
    generatePuzzle(difficulty);
  }, [difficulty]);

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Sudoku Puzzle</CardTitle>
          <div className="flex justify-center gap-2">
            {(['easy', 'medium', 'hard'] as const).map((level) => (
              <Button
                key={level}
                variant={difficulty === level ? "default" : "outline"}
                size="sm"
                onClick={() => setDifficulty(level)}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-9 gap-1 mb-6 max-w-md mx-auto">
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    w-8 h-8 border text-sm font-semibold
                    ${selectedCell?.row === rowIndex && selectedCell?.col === colIndex 
                      ? 'bg-blue-200 border-blue-500' 
                      : 'bg-white border-gray-300 hover:bg-gray-50'
                    }
                    ${(rowIndex + 1) % 3 === 0 ? 'border-b-2 border-b-gray-600' : ''}
                    ${(colIndex + 1) % 3 === 0 ? 'border-r-2 border-r-gray-600' : ''}
                  `}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell || ''}
                </button>
              ))
            )}
          </div>
          
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Number Pad</h3>
            <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <Button
                  key={num}
                  variant="outline"
                  size="sm"
                  onClick={() => handleNumberInput(num)}
                  disabled={!selectedCell}
                >
                  {num}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={clearCell}
                disabled={!selectedCell}
              >
                Clear
              </Button>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <Button onClick={() => generatePuzzle(difficulty)}>
              New Puzzle
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SudokuGame;
