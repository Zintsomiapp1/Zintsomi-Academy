
import React from 'react';
import { CheckersBoard as CheckersBoardType } from './CheckersTypes';
import CheckersPiece from './CheckersPiece';

interface CheckersBoardProps {
  board: CheckersBoardType;
  selectedSquare: [number, number] | null;
  validMoves: [number, number][];
  currentPlayer: 'red' | 'black';
  isProcessingMove: boolean;
  onSquareClick: (row: number, col: number) => void;
  onDragStart: (e: React.DragEvent, row: number, col: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, row: number, col: number) => void;
}

const CheckersBoard = ({
  board,
  selectedSquare,
  validMoves,
  currentPlayer,
  isProcessingMove,
  onSquareClick,
  onDragStart,
  onDragOver,
  onDrop
}: CheckersBoardProps) => {
  const getSquareClass = (row: number, col: number) => {
    const isLight = (row + col) % 2 === 0;
    const isSelected = selectedSquare && selectedSquare[0] === row && selectedSquare[1] === col;
    const isValidMove = validMoves.some(([vRow, vCol]) => vRow === row && vCol === col) && !board[row][col];
    
    let baseClass = "w-16 h-16 flex items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-105 relative ";
    
    if (isLight) {
      baseClass += "bg-gradient-to-br from-amber-100 to-amber-200 shadow-inner ";
    } else {
      baseClass += "bg-gradient-to-br from-amber-700 to-amber-900 shadow-lg ";
    }
    
    // Add 3D effect
    baseClass += "border border-amber-300 shadow-md hover:shadow-xl ";
    
    if (isSelected) {
      baseClass += "ring-4 ring-blue-400 ring-opacity-75 shadow-blue-400/50 ";
    }
    
    if (isValidMove) {
      baseClass += "ring-2 ring-green-400 ring-opacity-60 ";
    }
    
    return baseClass;
  };

  return (
    <div className="flex justify-center mb-6">
      <div className="grid grid-cols-8 border-4 border-amber-400 shadow-2xl rounded-lg overflow-hidden transform perspective-1000">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={getSquareClass(rowIndex, colIndex)}
              onClick={() => onSquareClick(rowIndex, colIndex)}
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, rowIndex, colIndex)}
            >
              {piece && (
                <CheckersPiece
                  piece={piece}
                  row={rowIndex}
                  col={colIndex}
                  canDrag={piece.color === 'red' && currentPlayer === 'red' && !isProcessingMove}
                  onDragStart={onDragStart}
                />
              )}
              {validMoves.some(([vRow, vCol]) => vRow === rowIndex && vCol === colIndex) && !piece && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-400 rounded-full opacity-60 animate-pulse"></div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CheckersBoard;
