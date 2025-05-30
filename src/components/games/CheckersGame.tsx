
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, Brain, User, Crown } from 'lucide-react';
import { useGamingTime } from '@/hooks/useGamingTime';
import GamingTimeDisplay from './GamingTimeDisplay';
import TimePurchaseModal from './TimePurchaseModal';

interface CheckersGameProps {
  onBack: () => void;
}

type PieceType = 'regular' | 'king';
type PieceColor = 'red' | 'black';

interface CheckersPiece {
  type: PieceType;
  color: PieceColor;
}

type CheckersBoard = (CheckersPiece | null)[][];

const CheckersGame = ({ onBack }: CheckersGameProps) => {
  const gamingTime = useGamingTime();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<PieceColor>('red');
  const [gameStatus, setGameStatus] = useState<'playing' | 'red-wins' | 'black-wins' | 'draw'>('playing');
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [mustCapture, setMustCapture] = useState<[number, number][] | null>(null);

  // Initialize checkers board
  const initializeBoard = (): CheckersBoard => {
    const board: CheckersBoard = Array(8).fill(null).map(() => Array(8).fill(null));
    
    // Place black pieces (top 3 rows, only on dark squares)
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 === 1) {
          board[row][col] = { type: 'regular', color: 'black' };
        }
      }
    }
    
    // Place red pieces (bottom 3 rows, only on dark squares)
    for (let row = 5; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 === 1) {
          board[row][col] = { type: 'regular', color: 'red' };
        }
      }
    }
    
    return board;
  };

  const [board, setBoard] = useState<CheckersBoard>(initializeBoard);

  const isValidMove = (fromRow: number, fromCol: number, toRow: number, toCol: number): boolean => {
    const piece = board[fromRow][fromCol];
    if (!piece) return false;
    
    const rowDiff = toRow - fromRow;
    const colDiff = Math.abs(toCol - fromCol);
    
    // Must move diagonally
    if (Math.abs(rowDiff) !== colDiff) return false;
    
    // Regular pieces can only move forward (except kings)
    if (piece.type === 'regular') {
      if (piece.color === 'red' && rowDiff > 0) return false;
      if (piece.color === 'black' && rowDiff < 0) return false;
    }
    
    // Check if destination is empty
    if (board[toRow][toCol] !== null) return false;
    
    // Simple move (1 square diagonally)
    if (Math.abs(rowDiff) === 1) {
      return true;
    }
    
    // Jump move (2 squares diagonally with capture)
    if (Math.abs(rowDiff) === 2) {
      const midRow = fromRow + rowDiff / 2;
      const midCol = fromCol + (toCol - fromCol) / 2;
      const middlePiece = board[midRow][midCol];
      
      return middlePiece !== null && middlePiece.color !== piece.color;
    }
    
    return false;
  };

  const makeAIMove = () => {
    // Simple AI: find all valid moves and pick randomly
    const validMoves: Array<{ from: [number, number], to: [number, number], isCapture: boolean }> = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.color === 'black') {
          // Check all possible moves
          for (let newRow = 0; newRow < 8; newRow++) {
            for (let newCol = 0; newCol < 8; newCol++) {
              if (isValidMove(row, col, newRow, newCol)) {
                const isCapture = Math.abs(newRow - row) === 2;
                validMoves.push({ from: [row, col], to: [newRow, newCol], isCapture });
              }
            }
          }
        }
      }
    }
    
    // Prioritize captures
    const captures = validMoves.filter(move => move.isCapture);
    const movesToConsider = captures.length > 0 ? captures : validMoves;
    
    if (movesToConsider.length > 0) {
      const randomMove = movesToConsider[Math.floor(Math.random() * movesToConsider.length)];
      makeMove(randomMove.from[0], randomMove.from[1], randomMove.to[0], randomMove.to[1]);
      setMoveHistory(prev => [...prev, `Khalulu: ${String.fromCharCode(97 + randomMove.from[1])}${8 - randomMove.from[0]} to ${String.fromCharCode(97 + randomMove.to[1])}${8 - randomMove.to[0]}`]);
      setCurrentPlayer('red');
    }
  };

  const makeMove = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    if (!isValidMove(fromRow, fromCol, toRow, toCol)) return false;
    
    const newBoard = board.map(row => [...row]);
    const piece = newBoard[fromRow][fromCol]!;
    
    // Move the piece
    newBoard[toRow][toCol] = piece;
    newBoard[fromRow][fromCol] = null;
    
    // Handle capture
    if (Math.abs(toRow - fromRow) === 2) {
      const midRow = fromRow + (toRow - fromRow) / 2;
      const midCol = fromCol + (toCol - fromCol) / 2;
      newBoard[midRow][midCol] = null;
    }
    
    // Check for king promotion
    if (piece.color === 'red' && toRow === 0) {
      newBoard[toRow][toCol] = { ...piece, type: 'king' };
    } else if (piece.color === 'black' && toRow === 7) {
      newBoard[toRow][toCol] = { ...piece, type: 'king' };
    }
    
    setBoard(newBoard);
    return true;
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
      
      if (piece && piece.color === 'red') {
        if (makeMove(fromRow, fromCol, row, col)) {
          setMoveHistory(prev => [...prev, `You: ${String.fromCharCode(97 + fromCol)}${8 - fromRow} to ${String.fromCharCode(97 + col)}${8 - row}`]);
          setCurrentPlayer('black');
          
          // AI move after a delay
          setTimeout(() => {
            makeAIMove();
          }, 1000);
        }
      }
      
      setSelectedSquare(null);
    } else {
      // Select piece
      const piece = board[row][col];
      if (piece && piece.color === 'red') {
        setSelectedSquare([row, col]);
      }
    }
  };

  const resetGame = () => {
    setBoard(initializeBoard());
    setSelectedSquare(null);
    setCurrentPlayer('red');
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
    const piece = board[row][col];
    
    let baseClass = "w-12 h-12 flex items-center justify-center cursor-pointer transition-colors ";
    baseClass += isLight ? "bg-amber-100 " : "bg-amber-800 ";
    
    if (isSelected) {
      baseClass += "ring-2 ring-blue-500 ";
    } else if (piece && piece.color === 'red' && currentPlayer === 'red') {
      baseClass += "hover:bg-opacity-80 ";
    }
    
    return baseClass;
  };

  const renderPiece = (piece: CheckersPiece) => {
    const baseClass = "w-8 h-8 rounded-full border-2 flex items-center justify-center ";
    const colorClass = piece.color === 'red' ? "bg-red-500 border-red-700 " : "bg-gray-800 border-gray-900 ";
    
    return (
      <div className={baseClass + colorClass}>
        {piece.type === 'king' && <Crown className="w-4 h-4 text-yellow-300" />}
      </div>
    );
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
                <span>Checkers vs AI Khalulu</span>
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
                        {piece && renderPiece(piece)}
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-4 mb-2">
                  <div className={`flex items-center gap-2 ${currentPlayer === 'red' ? 'font-bold text-red-600' : 'text-gray-500'}`}>
                    <User className="w-4 h-4" />
                    <span>Your Turn (Red)</span>
                  </div>
                  <div className={`flex items-center gap-2 ${currentPlayer === 'black' ? 'font-bold text-gray-800' : 'text-gray-500'}`}>
                    <Brain className="w-4 h-4" />
                    <span>Khalulu (Black)</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {selectedSquare ? 'Click a dark square to move your piece' : 'Click on your red piece to select it'}
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

          <Card>
            <CardHeader>
              <CardTitle>How to Play</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2">
                <p>• Move diagonally on dark squares only</p>
                <p>• Jump over opponent pieces to capture</p>
                <p>• Reach the opposite end to become a King</p>
                <p>• Kings can move backward</p>
                <p>• Capture all opponent pieces to win!</p>
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

export default CheckersGame;
