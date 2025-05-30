
import React from 'react';
import { ChessPiece as ChessPieceType, getPieceSymbol } from './chessPieces';

interface ChessPieceProps {
  piece: ChessPieceType;
}

const ChessPiece = ({ piece }: ChessPieceProps) => {
  const getPieceClass = (piece: ChessPieceType) => {
    const baseClass = "drop-shadow-lg transform transition-transform duration-200 hover:scale-110 ";
    return piece.color === 'white' 
      ? baseClass + "text-white filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
      : baseClass + "text-black filter drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]";
  };

  return (
    <span className={getPieceClass(piece)}>
      {getPieceSymbol(piece)}
    </span>
  );
};

export default ChessPiece;
