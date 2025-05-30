
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
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);

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

  const isValidPawnMove = (fromRow: number, fromCol: number, toRow: number, toCol: number, piece: ChessPiece): boolean => {
    const direction = piece.color === 'white' ? -1 : 1;
    const startRow = piece.color === 'white' ? 6 : 1;
    const targetPiece = board[toRow][toCol];

    // Forward move
    if (fromCol === toCol) {
      if (targetPiece) return false; // Can't move forward to occupied square
      if (toRow === fromRow + direction) return true; // One square forward
      if (fromRow === startRow && toRow === fromRow + 2 * direction) return true; // Two squares from start
    }
    
    // Diagonal capture
    if (Math.abs(fromCol - toCol) === 1 && toRow === fromRow + direction) {
      return targetPiece && targetPiece.color !== piece.color;
    }
    
    return false;
  };

  const isValidRookMove = (fromRow: number, fromCol: number, toRow: number, toCol: number): boolean => {
    if (fromRow !== toRow && fromCol !== toCol) return false;
    
    // Check path is clear
    const rowStep = fromRow === toRow ? 0 : (toRow > fromRow ? 1 : -1);
    const colStep = fromCol === toCol ? 0 : (toCol > fromCol ? 1 : -1);
    
    let checkRow = fromRow + rowStep;
    let checkCol = fromCol + colStep;
    
    while (checkRow !== toRow || checkCol !== toCol) {
      if (board[checkRow][checkCol]) return false;
      checkRow += rowStep;
      checkCol += colStep;
    }
    
    return true;
  };

  const isValidBishopMove = (fromRow: number, fromCol: number, toRow: number, toCol: number): boolean => {
    if (Math.abs(fromRow - toRow) !== Math.abs(fromCol - toCol)) return false;
    
    // Check path is clear
    const rowStep = toRow > fromRow ? 1 : -1;
    const colStep = toCol > fromCol ? 1 : -1;
    
    let checkRow = fromRow + rowStep;
    let checkCol = fromCol + colStep;
    
    while (checkRow !== toRow && checkCol !== toCol) {
      if (board[checkRow][checkCol]) return false;
      checkRow += rowStep;
      checkCol += colStep;
    }
    
    return true;
  };

  const isValidKnightMove = (fromRow: number, fromCol: number, toRow: number, toCol: number): boolean => {
    const rowDiff = Math.abs(fromRow - toRow);
    const colDiff = Math.abs(fromCol - toCol);
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
  };

  const isValidKingMove = (fromRow: number, fromCol: number, toRow: number, toCol: number): boolean => {
    const rowDiff = Math.abs(fromRow - toRow);
    const colDiff = Math.abs(fromCol - toCol);
    return rowDiff <= 1 && colDiff <= 1;
  };

  const isValidMove = (fromRow: number, fromCol: number, toRow: number, toCol: number): boolean => {
    if (toRow < 0 || toRow >= 8 || toCol < 0 || toCol >= 8) return false;
    
    const piece = board[fromRow][fromCol];
    if (!piece) return false;
    
    const targetPiece = board[toRow][toCol];
    if (targetPiece && targetPiece.color === piece.color) return false;
    
    switch (piece.type) {
      case 'pawn':
        return isValidPawnMove(fromRow, fromCol, toRow, toCol, piece);
      case 'rook':
        return isValidRookMove(fromRow, fromCol, toRow, toCol);
      case 'bishop':
        return isValidBishopMove(fromRow, fromCol, toRow, toCol);
      case 'knight':
        return isValidKnightMove(fromRow, fromCol, toRow, toCol);
      case 'queen':
        return isValidRookMove(fromRow, fromCol, toRow, toCol) || isValidBishopMove(fromRow, fromCol, toRow, toCol);
      case 'king':
        return isValidKingMove(fromRow, fromCol, toRow, toCol);
      default:
        return false;
    }
  };

  const getValidMoves = (row: number, col: number): [number, number][] => {
    const moves: [number, number][] = [];
    for (let toRow = 0; toRow < 8; toRow++) {
      for (let toCol = 0; toCol < 8; toCol++) {
        if (isValidMove(row, col, toRow, toCol)) {
          moves.push([toRow, toCol]);
        }
      }
    }
    return moves;
  };

  const makeAIMove = () => {
    const validAIMoves: Array<{ from: [number, number], to: [number, number] }> = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.color === 'black') {
          const moves = getValidMoves(row, col);
          moves.forEach(([toRow, toCol]) => {
            validAIMoves.push({ from: [row, col], to: [toRow, toCol] });
          });
        }
      }
    }
    
    if (validAIMoves.length > 0) {
      const randomMove = validAIMoves[Math.floor(Math.random() * validAIMoves.length)];
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
      const [fromRow, fromCol] = selectedSquare;
      
      if (isValidMove(fromRow, fromCol, row, col)) {
        const newBoard = board.map(row => [...row]);
        const piece = newBoard[fromRow][fromCol];
        newBoard[row][col] = piece;
        newBoard[fromRow][fromCol] = null;
        
        setBoard(newBoard);
        setMoveHistory(prev => [...prev, `You: ${String.fromCharCode(97 + fromCol)}${8 - fromRow} to ${String.fromCharCode(97 + col)}${8 - row}`]);
        setCurrentPlayer('black');
        setSelectedSquare(null);
        setValidMoves([]);
        
        // AI move after a delay
        setTimeout(() => {
          makeAIMove();
        }, 1000);
      } else {
        // Invalid move, just deselect
        setSelectedSquare(null);
        setValidMoves([]);
      }
    } else {
      // Select piece
      const piece = board[row][col];
      if (piece && piece.color === 'white') {
        setSelectedSquare([row, col]);
        setValidMoves(getValidMoves(row, col));
      }
    }
  };

  const resetGame = () => {
    setBoard(initializeBoard());
    setSelectedSquare(null);
    setCurrentPlayer('white');
    setGameStatus('playing');
    setMoveHistory([]);
    setValidMoves([]);
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
    
    let baseClass = "w-16 h-16 flex items-center justify-center text-3xl cursor-pointer transition-all duration-300 transform hover:scale-105 relative ";
    
    if (isLight) {
      baseClass += "bg-gradient-to-br from-slate-100 to-slate-200 shadow-inner ";
    } else {
      baseClass += "bg-gradient-to-br from-slate-700 to-slate-800 shadow-lg ";
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

  const getPieceClass = (piece: ChessPiece) => {
    const baseClass = "drop-shadow-lg transform transition-transform duration-200 hover:scale-110 ";
    return piece.color === 'white' 
      ? baseClass + "text-white filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
      : baseClass + "text-black filter drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]";
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
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100">
              <CardTitle className="flex items-center justify-between">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Chess vs AI Khalulu
                </span>
                <Button variant="outline" size="sm" onClick={resetGame} className="shadow-md">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  New Game
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex justify-center mb-6">
                <div className="grid grid-cols-8 border-4 border-slate-400 shadow-2xl rounded-lg overflow-hidden transform perspective-1000 rotate-x-12">
                  {board.map((row, rowIndex) =>
                    row.map((piece, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={getSquareClass(rowIndex, colIndex)}
                        onClick={() => handleSquareClick(rowIndex, colIndex)}
                      >
                        {piece && (
                          <span className={getPieceClass(piece)}>
                            {getPieceSymbol(piece)}
                          </span>
                        )}
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
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100">
              <CardTitle className="text-lg">Move History</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {moveHistory.length === 0 ? (
                  <p className="text-gray-500 text-sm italic">No moves yet - make your first move!</p>
                ) : (
                  moveHistory.map((move, index) => (
                    <div key={index} className="text-sm p-2 rounded bg-gray-50 border-l-4 border-blue-200">
                      <span className="font-medium text-gray-600">{index + 1}.</span> {move}
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
