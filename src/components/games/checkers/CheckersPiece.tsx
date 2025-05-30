
import React from 'react';
import { Crown } from 'lucide-react';
import { CheckersPiece as CheckersPieceType } from './CheckersTypes';

interface CheckersPieceProps {
  piece: CheckersPieceType;
  row: number;
  col: number;
  canDrag: boolean;
  onDragStart: (e: React.DragEvent, row: number, col: number) => void;
}

const CheckersPiece = ({ piece, row, col, canDrag, onDragStart }: CheckersPieceProps) => {
  const baseClass = "w-12 h-12 rounded-full border-4 flex items-center justify-center transform transition-all duration-300 hover:scale-110 cursor-grab active:cursor-grabbing ";
  let colorClass = "";
  
  if (piece.color === 'red') {
    colorClass = "bg-gradient-to-br from-red-400 to-red-700 border-red-800 shadow-lg ";
    colorClass += "drop-shadow-[0_4px_8px_rgba(220,38,38,0.6)] ";
  } else {
    colorClass = "bg-gradient-to-br from-gray-700 to-black border-gray-900 shadow-xl ";
    colorClass += "drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] ";
  }
  
  return (
    <div
      className={baseClass + colorClass}
      draggable={canDrag}
      onDragStart={(e) => onDragStart(e, row, col)}
    >
      {piece.type === 'king' && (
        <Crown className="w-6 h-6 text-yellow-300 filter drop-shadow-lg" />
      )}
    </div>
  );
};

export default CheckersPiece;
