
import { ChessBoard } from './chessPieces';
import { getValidMoves } from './chessMoves';

export const makeAIMove = (board: ChessBoard): { newBoard: ChessBoard; move: string } | null => {
  const validAIMoves: Array<{ from: [number, number], to: [number, number] }> = [];
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === 'black') {
        const moves = getValidMoves(row, col, board);
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
    
    const moveNotation = `Khalulu: ${String.fromCharCode(97 + randomMove.from[1])}${8 - randomMove.from[0]} to ${String.fromCharCode(97 + randomMove.to[1])}${8 - randomMove.to[0]}`;
    
    return { newBoard, move: moveNotation };
  }
  
  return null;
};
