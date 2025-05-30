
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, Brain, User } from 'lucide-react';
import { useGamingTime } from '@/hooks/useGamingTime';
import GamingTimeDisplay from './GamingTimeDisplay';
import TimePurchaseModal from './TimePurchaseModal';

interface ChessGameProps {
  onBack: () => void;
}

type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
type PieceColor = 'white' | 'black';

interface ChessPiece {
  type: PieceType;
  color: PieceColor;
}

type ChessBoard = (ChessPiece | null)[][];

const ChessGame = ({ onBack }: ChessGameProps) => {
  const gamingTime = useGamingTime();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<PieceColor>('white');
  const [gameStatus, setGameStatus] = useState<'playing' | 'checkmate' | 'draw'>('playing');
  const [moveHistory, setMoveHistory] = useState<string[]>([]);

  // Initialize chess board
  const initializeBoard = (): ChessBoard => {
    const board: ChessBoard = Array(8).fill(null).map(() => Array(8).fill(null));
    
    // Place pieces
    const pieceOrder: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
    
    // Black pieces
    for (let col = 0; col < 8; col++) {
      board[0][col] = { type: pieceOrder[col], color: 'black' };
      board[1][col] = { type: 'pawn', color: 'black' };
    }
    
    // White pieces
    for (let col = 0; col < 8; col++) {
      board[7][col] = { type: pieceOrder[col], color: 'white' };
      board[6][col] = { type: 'pawn', color: 'white' };
    }
    
    return board;
  };

  const [board, setBoard] = useState<ChessBoard>(initializeBoard);

  const getPieceSymbol = (piece: ChessPiece): string => {
    const symbols = {
      white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
      black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' }
    };
    return symbols[piece.color][piece.type];
  };

  const makeAIMove = () => {
    // Simple AI: make a random valid move
    const validMoves: Array<{ from: [number, number], to: [number, number] }> = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.color === 'black') {
          // Find valid moves for this piece (simplified)
          for (let newRow = 0; newRow < 8; newRow++) {
            for (let newCol = 0; newCol < 8; newCol++) {
              const targetPiece = board[newRow][newCol];
              if (!targetPiece || targetPiece.color !== piece.color) {
                validMoves.push({ from: [row, col], to: [newRow, newCol] });
              }
            }
          }
        }
      }
    }
    
    if (validMoves.length > 0) {
      const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
      const newBoard = board.map(row => [...row]);
      const piece = newBoard[randomMove.from[0]][randomMove.from[1]];
      newBoard[randomMove.to[0]][randomMove.to[1]] = piece;
      newBoard[randomMove.from[0]][randomMove.from[1]] = null;
      
      setBoard(newBoard);
      setMoveHistory(prev => [...prev, `Khalulu: ${String.fromCharCode(97 + randomMove.from[1])}${8 - randomMove.from[0]} to ${String.fromCharCode(97 + randomMove.to[1])}${8 - randomMove.to[0]}`]);
      setCurrentPlayer('white');
    }
  };

  const handleSquareClick = (row: number, col: number) => {
    if (!gamingTime.isPlaying || gamingTime.totalTimeRemaining <= 0) {
      setShowPurchaseModal(true);
      return;
    }

    if (currentPlayer === 'black') return; // AI's turn

    if (selectedSquare) {
      // Try to move piece
      const [fromRow, fromCol] = selectedSquare;
      const piece = board[fromRow][fromCol];
      
      if (piece && piece.color === 'white') {
        const newBoard = board.map(row => [...row]);
        newBoard[row][col] = piece;
        newBoard[fromRow][fromCol] = null;
        
        setBoard(newBoard);
        setMoveHistory(prev => [...prev, `You: ${String.fromCharCode(97 + fromCol)}${8 - fromRow} to ${String.fromCharCode(97 + col)}${8 - row}`]);
        setCurrentPlayer('black');
        
        // AI move after a delay
        setTimeout(() => {
          makeAIMove();
        }, 1000);
      }
      
      setSelectedSquare(null);
    } else {
      // Select piece
      const piece = board[row][col];
      if (piece && piece.color === 'white') {
        setSelectedSquare([row, col]);
      }
    }
  };

  const resetGame = () => {
    setBoard(initializeBoard());
    setSelectedSquare(null);
    setCurrentPlayer('white');
    setGameStatus('playing');
    setMoveHistory([]);
  };

  useEffect(() => {
    if (gamingTime.totalTimeRemaining > 0) {
      gamingTime.startPlaying();
    }
    
    return () => {
      gamingTime.stopPlaying();
    };
  }, []);

  const getSquareClass = (row: number, col: number) => {
    const isLight = (row + col) % 2 === 0;
    const isSelected = selectedSquare && selectedSquare[0] === row && selectedSquare[1] === col;
    
    let baseClass = "w-12 h-12 flex items-center justify-center text-2xl cursor-pointer transition-colors ";
    baseClass += isLight ? "bg-amber-100 " : "bg-amber-700 ";
    
    if (isSelected) {
      baseClass += "ring-2 ring-blue-500 ";
    } else {
      baseClass += "hover:bg-opacity-80 ";
    }
    
    return baseClass;
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Games
      </Button>

      <GamingTimeDisplay
        timeRemaining={gamingTime.totalTimeRemaining}
        formatTime={gamingTime.formatTime}
        getFreeTimeRemaining={gamingTime.getFreeTimeRemaining}
        getTimeUntilReset={gamingTime.getTimeUntilReset}
        onPurchaseClick={() => setShowPurchaseModal(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Chess vs AI Khalulu</span>
                <Button variant="outline" size="sm" onClick={resetGame}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  New Game
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-4">
                <div className="grid grid-cols-8 border-2 border-gray-800">
                  {board.map((row, rowIndex) =>
                    row.map((piece, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={getSquareClass(rowIndex, colIndex)}
                        onClick={() => handleSquareClick(rowIndex, colIndex)}
                      >
                        {piece && getPieceSymbol(piece)}
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-4 mb-2">
                  <div className={`flex items-center gap-2 ${currentPlayer === 'white' ? 'font-bold text-blue-600' : 'text-gray-500'}`}>
                    <User className="w-4 h-4" />
                    <span>Your Turn (White)</span>
                  </div>
                  <div className={`flex items-center gap-2 ${currentPlayer === 'black' ? 'font-bold text-purple-600' : 'text-gray-500'}`}>
                    <Brain className="w-4 h-4" />
                    <span>Khalulu (Black)</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {selectedSquare ? 'Click a square to move your piece' : 'Click on your piece to select it'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Move History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {moveHistory.length === 0 ? (
                  <p className="text-gray-500 text-sm">No moves yet</p>
                ) : (
                  moveHistory.map((move, index) => (
                    <div key={index} className="text-sm">
                      {index + 1}. {move}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <TimePurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        onPurchase={() => {
          gamingTime.purchaseTime();
          setShowPurchaseModal(false);
        }}
        timeRemaining={gamingTime.totalTimeRemaining}
        formatTime={gamingTime.formatTime}
      />
    </div>
  );
};

export default ChessGame;
