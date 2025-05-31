import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, Brain, User, Crown } from 'lucide-react';
import { useGamingTime } from '@/hooks/useGamingTime';
import { useUserRole } from '@/hooks/useUserRole';
import GamingTimeDisplay from './GamingTimeDisplay';
import TimePurchaseModal from './TimePurchaseModal';
import CheckersBoard from './checkers/CheckersBoard';
import { useCheckersGame } from './checkers/useCheckersGame';

interface CheckersGameProps {
  onBack: () => void;
}

const CheckersGame = ({ onBack }: CheckersGameProps) => {
  const gamingTime = useGamingTime();
  const { isAdmin, loading } = useUserRole();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  
  const {
    board,
    selectedSquare,
    currentPlayer,
    gameStatus,
    moveHistory,
    validMoves,
    draggedPiece,
    isProcessingMove,
    setSelectedSquare,
    setValidMoves,
    setDraggedPiece,
    setCurrentPlayer,
    setMoveHistory,
    setIsProcessingMove,
    getValidMovesForPiece,
    makeMove,
    makeAIMove,
    resetGame
  } = useCheckersGame();

  const handleSquareClick = (row: number, col: number) => {
    // Skip time check for admins
    if (!isAdmin && (!gamingTime.isPlaying || gamingTime.totalTimeRemaining <= 0)) {
      setShowPurchaseModal(true);
      return;
    }

    if (currentPlayer === 'black' || isProcessingMove) return; // AI's turn or processing

    if (selectedSquare) {
      const [fromRow, fromCol] = selectedSquare;
      
      if (makeMove(fromRow, fromCol, row, col)) {
        setMoveHistory(prev => [...prev, `You: ${String.fromCharCode(97 + fromCol)}${8 - fromRow} to ${String.fromCharCode(97 + col)}${8 - row}`]);
        setCurrentPlayer('black');
        setSelectedSquare(null);
        setValidMoves([]);
        setIsProcessingMove(true);
        
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
    // Skip time check for admins
    if (!isAdmin && (!gamingTime.isPlaying || gamingTime.totalTimeRemaining <= 0)) {
      e.preventDefault();
      setShowPurchaseModal(true);
      return;
    }

    if (currentPlayer === 'black' || isProcessingMove) {
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
    
    if (draggedPiece && !isProcessingMove) {
      const [fromRow, fromCol] = draggedPiece.from;
      
      if (makeMove(fromRow, fromCol, row, col)) {
        setMoveHistory(prev => [...prev, `You: ${String.fromCharCode(97 + fromCol)}${8 - fromRow} to ${String.fromCharCode(97 + col)}${8 - row}`]);
        setCurrentPlayer('black');
        setIsProcessingMove(true);
        
        setTimeout(() => {
          makeAIMove();
        }, 1000);
      }
      
      setDraggedPiece(null);
      setValidMoves([]);
    }
  };

  useEffect(() => {
    // Only start gaming time for non-admin users and only after admin status is determined
    if (!loading && !isAdmin && gamingTime.totalTimeRemaining > 0) {
      gamingTime.startPlaying();
    }
    
    return () => {
      // Only stop gaming time for non-admin users
      if (!loading && !isAdmin) {
        gamingTime.stopPlaying();
      }
    };
  }, [isAdmin, loading]);

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

      {/* Only show gaming time display for non-admin users */}
      {!isAdmin && !loading && (
        <GamingTimeDisplay
          timeRemaining={gamingTime.totalTimeRemaining}
          formatTime={gamingTime.formatTime}
          getFreeTimeRemaining={gamingTime.getFreeTimeRemaining}
          getTimeUntilReset={gamingTime.getTimeUntilReset}
          onPurchaseClick={() => setShowPurchaseModal(true)}
        />
      )}

      {/* Show admin indicator */}
      {isAdmin && !loading && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 shadow-lg border border-purple-200">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-purple-600" />
            <span className="font-semibold text-purple-800">Admin Mode - Unlimited Gaming Time</span>
          </div>
        </div>
      )}

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
              <CheckersBoard
                board={board}
                selectedSquare={selectedSquare}
                validMoves={validMoves}
                currentPlayer={currentPlayer}
                isProcessingMove={isProcessingMove}
                onSquareClick={handleSquareClick}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
              
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

      {/* Only show purchase modal for non-admin users */}
      {!isAdmin && !loading && (
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
      )}
    </div>
  );
};

export default CheckersGame;
