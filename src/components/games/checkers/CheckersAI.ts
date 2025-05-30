
import { CheckersBoard, CheckersMove, CheckersPiece } from './CheckersTypes';

export class CheckersAI {
  static getValidMovesForPiece(board: CheckersBoard, fromRow: number, fromCol: number): [number, number][] {
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
  }

  static getAllValidAIMoves(board: CheckersBoard): CheckersMove[] {
    const validAIMoves: CheckersMove[] = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.color === 'black') {
          const moves = this.getValidMovesForPiece(board, row, col);
          moves.forEach(([toRow, toCol]) => {
            const isCapture = Math.abs(toRow - row) === 2;
            validAIMoves.push({ from: [row, col], to: [toRow, toCol], isCapture });
          });
        }
      }
    }
    
    return validAIMoves;
  }

  static selectBestMove(validMoves: CheckersMove[]): CheckersMove | null {
    if (validMoves.length === 0) return null;
    
    // Prioritize captures
    const captures = validMoves.filter(move => move.isCapture);
    const movesToConsider = captures.length > 0 ? captures : validMoves;
    
    return movesToConsider[Math.floor(Math.random() * movesToConsider.length)];
  }
}
