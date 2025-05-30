
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
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);
  const [draggedPiece, setDraggedPiece] = useState<{ piece: CheckersPiece; from: [number, number] } | null>(null);

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

  const getValidMovesForPiece = (fromRow: number, fromCol: number): [number, number][] => {
    const piece = board[fromRow][fromCol];
    if (!piece) return [];
    
    const moves: [number, number][] = [];
    const directions = piece.type === 'king' 
      ? [[-1, -1], [-1, 1], [1, -1], [1, 1]] // Kings can move in all directions
      : piece.color === 'red' 
        ? [[-1, -1], [-1, 1]] // Red moves up
        : [[1, -1], [1, 1]]; // Black moves down
    
    for (const [rowDir, colDir] of directions) {
      // Simple move (1 square)
      const newRow = fromRow + rowDir;
      const newCol = fromCol + colDir;
      
      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8 && !board[newRow][newCol]) {
        moves.push([newRow, newCol]);
      }
      
      // Jump move (2 squares with capture)
      const jumpRow = fromRow + rowDir * 2;
      const jumpCol = fromCol + colDir * 2;
      
      if (jumpRow >= 0 && jumpRow < 8 && jumpCol >= 0 && jumpCol < 8 && 
          board[newRow][newCol] && board[newRow][newCol]!.color !== piece.color && 
          !board[jumpRow][jumpCol]) {
        moves.push([jumpRow, jumpCol]);
      }
    }
    
    return moves;
  };

  const isValidMove = (fromRow: number, fromCol: number, toRow: number, toCol: number): boolean => {
    const validMoves = getValidMovesForPiece(fromRow, fromCol);
    return validMoves.some(([row, col]) => row === toRow && col === toCol);
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

  const makeAIMove = () => {
    const validAIMoves: Array<{ from: [number, number], to: [number, number], isCapture: boolean }> = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.color === 'black') {
          const moves = getValidMovesForPiece(row, col);
          moves.forEach(([toRow, toCol]) => {
            const isCapture = Math.abs(toRow - row) === 2;
            validAIMoves.push({ from: [row, col], to: [toRow, toCol], isCapture });
          });
        }
      }
    }
    
    // Prioritize captures
    const captures = validAIMoves.filter(move => move.isCapture);
    const movesToConsider = captures.length > 0 ? captures : validAIMoves;
    
    if (movesToConsider.length > 0) {
      const randomMove = movesToConsider[Math.floor(Math.random() * movesToConsider.length)];
      makeMove(randomMove.from[0], randomMove.from[1], randomMove.to[0], randomMove.to[1]);
      setMoveHistory(prev => [...prev, `Khalulu: ${String.fromCharCode(97 + randomMove.from[1])}${8 - randomMove.from[0]} to ${String.fromCharCode(97 + randomMove.to[1])}${8 - randomMove.to[0]}`]);
      setCurrentPlayer('red');
    }
  };

  const handleSquareClick = (row: number, col: number) => {
    if (!gamingTime.isPlaying || gamingTime.totalTimeRemaining <= 0) {
      setShowPurchaseModal(true);
      return;
    }

    if (currentPlayer === 'black') return; // AI's turn

    if (selectedSquare) {
      const [fromRow, fromCol] = selectedSquare;
      
      if (makeMove(fromRow, fromCol, row, col)) {
        setMoveHistory(prev => [...prev, `You: ${String.fromCharCode(97 + fromCol)}${8 - fromRow} to ${String.fromCharCode(97 + col)}${8 - row}`]);
        setCurrentPlayer('black');
        setSelectedSquare(null);
        setValidMoves([]);
        
        // AI move after a delay
        setTimeout(() => {
          makeAIMove();
        }, 1000);
      } else {
        setSelectedSquare(null);
        setValidMoves([]);
      }
    } else {
      // Select piece
      const piece = board[row][col];
      if (piece && piece.color === 'red') {
        setSelectedSquare([row, col]);
        setValidMoves(getValidMovesForPiece(row, col));
      }
    }
  };

  const handleDragStart = (e: React.DragEvent, row: number, col: number) => {
    if (!gamingTime.isPlaying || gamingTime.totalTimeRemaining <= 0) {
      e.preventDefault();
      setShowPurchaseModal(true);
      return;
    }

    if (currentPlayer === 'black') {
      e.preventDefault();
      return;
    }

    const piece = board[row][col];
    if (piece && piece.color === 'red') {
      setDraggedPiece({ piece, from: [row, col] });
      setValidMoves(getValidMovesForPiece(row, col));
      e.dataTransfer.effectAllowed = 'move';
    } else {
      e.preventDefault();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, row: number, col: number) => {
    e.preventDefault();
    
    if (draggedPiece) {
      const [fromRow, fromCol] = draggedPiece.from;
      
      if (makeMove(fromRow, fromCol, row, col)) {
        setMoveHistory(prev => [...prev, `You: ${String.fromCharCode(97 + fromCol)}${8 - fromRow} to ${String.fromCharCode(97 + col)}${8 - row}`]);
        setCurrentPlayer('black');
        
        setTimeout(() => {
          makeAIMove();
        }, 1000);
      }
      
      setDraggedPiece(null);
      setValidMoves([]);
    }
  };

  const resetGame = () => {
    setBoard(initializeBoard());
    setSelectedSquare(null);
    setCurrentPlayer('red');
    setGameStatus('playing');
    setMoveHistory([]);
    setValidMoves([]);
    setDraggedPiece(null);
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
    const isValidMove = validMoves.some(([vRow, vCol]) => vRow === row && vCol === col);
    const piece = board[row][col];
    
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

  const renderPiece = (piece: CheckersPiece, row: number, col: number) => {
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
        draggable={piece.color === 'red' && currentPlayer === 'red'}
        onDragStart={(e) => handleDragStart(e, row, col)}
      >
        {piece.type === 'king' && (
          <Crown className="w-6 h-6 text-yellow-300 filter drop-shadow-lg" />
        )}
        {/* Add highlight dots for valid moves */}
        {validMoves.some(([vRow, vCol]) => vRow === row && vCol === col) && !board[row][col] && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-green-400 rounded-full opacity-70 animate-pulse"></div>
          </div>
        )}
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
          <Card className="shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100">
              <CardTitle className="flex items-center justify-between">
                <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-black bg-clip-text text-transparent">
                  Checkers vs AI Khalulu
                </span>
                <Button variant="outline" size="sm" onClick={resetGame} className="shadow-md">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  New Game
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex justify-center mb-6">
                <div className="grid grid-cols-8 border-4 border-amber-400 shadow-2xl rounded-lg overflow-hidden transform perspective-1000">
                  {board.map((row, rowIndex) =>
                    row.map((piece, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={getSquareClass(rowIndex, colIndex)}
                        onClick={() => handleSquareClick(rowIndex, colIndex)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                      >
                        {piece && renderPiece(piece, rowIndex, colIndex)}
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
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-6 mb-4">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    currentPlayer === 'red' 
                      ? 'bg-red-100 text-red-800 font-bold shadow-md transform scale-105' 
                      : 'text-gray-500'
                  }`}>
                    <User className="w-5 h-5" />
                    <span>Your Turn (Red)</span>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    currentPlayer === 'black' 
                      ? 'bg-gray-100 text-gray-800 font-bold shadow-md transform scale-105' 
                      : 'text-gray-500'
                  }`}>
                    <Brain className="w-5 h-5" />
                    <span>Khalulu (Black)</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-red-50 to-gray-50 rounded-lg p-4 border border-red-200">
                  <p className="text-sm text-gray-700">
                    {selectedSquare || draggedPiece
                      ? 'Drag your piece to a highlighted square or click to move' 
                      : 'Click on your red piece to select it, or drag and drop to move'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100">
              <CardTitle className="text-lg">Move History</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {moveHistory.length === 0 ? (
                  <p className="text-gray-500 text-sm italic">No moves yet - make your first move!</p>
                ) : (
                  moveHistory.map((move, index) => (
                    <div key={index} className="text-sm p-2 rounded bg-gray-50 border-l-4 border-amber-200">
                      <span className="font-medium text-gray-600">{index + 1}.</span> {move}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100">
              <CardTitle className="text-lg">How to Play</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-sm space-y-2">
                <p>• Drag and drop or click to move pieces</p>
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
