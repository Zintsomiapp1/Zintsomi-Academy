
import React from 'react';
import { ChessBoard as ChessBoardType } from './chessPieces';
import ChessPiece from './ChessPiece';

interface ChessBoardProps {
  board: ChessBoardType;
  selectedSquare: [number, number] | null;
  validMoves: [number, number][];
  onSquareClick: (row: number, col: number) => void;
}

const ChessBoard = ({ board, selectedSquare, validMoves, onSquareClick }: ChessBoardProps) => {
  const getSquareClass = (row: number, col: number) => {
    const isLight = (row + col) % 2 === 0;
    const isSelected = selectedSquare && selectedSquare[0] === row && selectedSquare[1] === col;
    const isValidMove = validMoves.some(([vRow, vCol]) => vRow === row && vCol === col);
    
    let baseClass = "w-16 h-16 flex items-center justify-center text-3xl cursor-pointer transition-all duration-300 transform hover:scale-105 relative ";
    
    if (isLight) {
      baseClass += "bg-gradient-to-br from-yellow-200 to-yellow-300 shadow-inner ";
    } else {
      baseClass += "bg-gradient-to-br from-blue-200 to-blue-300 shadow-lg ";
    }
    
    // Add 3D effect
    baseClass += "border border-slate-300 shadow-md hover:shadow-xl ";
    
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
      <div className="grid grid-cols-8 border-4 border-slate-400 shadow-2xl rounded-lg overflow-hidden transform perspective-1000 rotate-x-12">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={getSquareClass(rowIndex, colIndex)}
              onClick={() => onSquareClick(rowIndex, colIndex)}
            >
              {piece && <ChessPiece piece={piece} />}
              {validMoves.some(([vRow, vCol]) => vRow === rowIndex && vCol === colIndex) && !piece && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-400 rounded-full opacity-60"></div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChessBoard;
