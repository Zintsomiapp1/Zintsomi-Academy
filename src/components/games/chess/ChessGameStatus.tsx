
import React from 'react';
import { User, Brain } from 'lucide-react';
import { PieceColor } from './chessPieces';

interface ChessGameStatusProps {
  currentPlayer: PieceColor;
  selectedSquare: [number, number] | null;
}

const ChessGameStatus = ({ currentPlayer, selectedSquare }: ChessGameStatusProps) => {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-6 mb-4">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
          currentPlayer === 'white' 
            ? 'bg-blue-100 text-blue-800 font-bold shadow-md transform scale-105' 
            : 'text-gray-500'
        }`}>
          <User className="w-5 h-5" />
          <span>Your Turn (White)</span>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
          currentPlayer === 'black' 
            ? 'bg-purple-100 text-purple-800 font-bold shadow-md transform scale-105' 
            : 'text-gray-500'
        }`}>
          <Brain className="w-5 h-5" />
          <span>Khalulu (Black)</span>
        </div>
      </div>
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
        <p className="text-sm text-gray-700">
          {selectedSquare 
            ? 'Click on a highlighted square to move your piece, or click another piece to select it' 
            : 'Click on your white piece to select it and see available moves'}
        </p>
      </div>
    </div>
  );
};

export default ChessGameStatus;
