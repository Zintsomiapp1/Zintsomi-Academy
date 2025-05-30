
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useGamingTime } from '@/hooks/useGamingTime';
import GamingTimeDisplay from './GamingTimeDisplay';
import TimePurchaseModal from './TimePurchaseModal';
import ChessBoard from './chess/ChessBoard';
import ChessGameStatus from './chess/ChessGameStatus';
import { ChessBoard as ChessBoardType, PieceColor, initializeBoard } from './chess/chessPieces';
import { isValidMove, getValidMoves } from './chess/chessMoves';
import { makeAIMove } from './chess/chessAI';

interface ChessGameProps {
  onBack: () => void;
}

type GameStatus = 'playing' | 'checkmate' | 'draw';

const ChessGame = ({ onBack }: ChessGameProps) => {
  const gamingTime = useGamingTime();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<PieceColor>('white');
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);
  const [board, setBoard] = useState<ChessBoardType>(initializeBoard);

  const handleSquareClick = (row: number, col: number) => {
    if (!gamingTime.isPlaying || gamingTime.totalTimeRemaining <= 0) {
      setShowPurchaseModal(true);
      return;
    }

    if (currentPlayer === 'black') return; // AI's turn

    if (selectedSquare) {
      const [fromRow, fromCol] = selectedSquare;
      
      if (isValidMove(fromRow, fromCol, row, col, board)) {
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
          const aiMoveResult = makeAIMove(newBoard);
          if (aiMoveResult) {
            setBoard(aiMoveResult.newBoard);
            setMoveHistory(prev => [...prev, aiMoveResult.move]);
            setCurrentPlayer('white');
          }
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
        setValidMoves(getValidMoves(row, col, board));
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
              <ChessBoard
                board={board}
                selectedSquare={selectedSquare}
                validMoves={validMoves}
                onSquareClick={handleSquareClick}
              />
              
              <ChessGameStatus
                currentPlayer={currentPlayer}
                selectedSquare={selectedSquare}
              />
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
