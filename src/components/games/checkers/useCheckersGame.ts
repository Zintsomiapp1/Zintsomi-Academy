
import { useState } from 'react';
import { CheckersBoard, CheckersPiece, PieceColor, GameStatus } from './CheckersTypes';
import { CheckersAI } from './CheckersAI';

export const useCheckersGame = () => {
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
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<PieceColor>('red');
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);
  const [draggedPiece, setDraggedPiece] = useState<{ piece: CheckersPiece; from: [number, number] } | null>(null);
  const [isProcessingMove, setIsProcessingMove] = useState(false);

  const getValidMovesForPiece = (fromRow: number, fromCol: number): [number, number][] => {
    return CheckersAI.getValidMovesForPiece(board, fromRow, fromCol);
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
    if (isProcessingMove) return;
    
    const validAIMoves = CheckersAI.getAllValidAIMoves(board);
    const selectedMove = CheckersAI.selectBestMove(validAIMoves);
    
    if (selectedMove) {
      if (makeMove(selectedMove.from[0], selectedMove.from[1], selectedMove.to[0], selectedMove.to[1])) {
        setMoveHistory(prev => [...prev, `Khalulu: ${String.fromCharCode(97 + selectedMove.from[1])}${8 - selectedMove.from[0]} to ${String.fromCharCode(97 + selectedMove.to[1])}${8 - selectedMove.to[0]}`]);
        setCurrentPlayer('red');
      }
    }
    setIsProcessingMove(false);
  };

  const resetGame = () => {
    setBoard(initializeBoard());
    setSelectedSquare(null);
    setCurrentPlayer('red');
    setGameStatus('playing');
    setMoveHistory([]);
    setValidMoves([]);
    setDraggedPiece(null);
    setIsProcessingMove(false);
  };

  return {
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
  };
};
