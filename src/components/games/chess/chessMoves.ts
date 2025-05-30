
import { ChessBoard, ChessPiece } from './chessPieces';

export const isValidPawnMove = (fromRow: number, fromCol: number, toRow: number, toCol: number, piece: ChessPiece, board: ChessBoard): boolean => {
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

export const isValidRookMove = (fromRow: number, fromCol: number, toRow: number, toCol: number, board: ChessBoard): boolean => {
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

export const isValidBishopMove = (fromRow: number, fromCol: number, toRow: number, toCol: number, board: ChessBoard): boolean => {
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

export const isValidKnightMove = (fromRow: number, fromCol: number, toRow: number, toCol: number): boolean => {
  const rowDiff = Math.abs(fromRow - toRow);
  const colDiff = Math.abs(fromCol - toCol);
  return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
};

export const isValidKingMove = (fromRow: number, fromCol: number, toRow: number, toCol: number): boolean => {
  const rowDiff = Math.abs(fromRow - toRow);
  const colDiff = Math.abs(fromCol - toCol);
  return rowDiff <= 1 && colDiff <= 1;
};

export const isValidMove = (fromRow: number, fromCol: number, toRow: number, toCol: number, board: ChessBoard): boolean => {
  if (toRow < 0 || toRow >= 8 || toCol < 0 || toCol >= 8) return false;
  
  const piece = board[fromRow][fromCol];
  if (!piece) return false;
  
  const targetPiece = board[toRow][toCol];
  if (targetPiece && targetPiece.color === piece.color) return false;
  
  switch (piece.type) {
    case 'pawn':
      return isValidPawnMove(fromRow, fromCol, toRow, toCol, piece, board);
    case 'rook':
      return isValidRookMove(fromRow, fromCol, toRow, toCol, board);
    case 'bishop':
      return isValidBishopMove(fromRow, fromCol, toRow, toCol, board);
    case 'knight':
      return isValidKnightMove(fromRow, fromCol, toRow, toCol);
    case 'queen':
      return isValidRookMove(fromRow, fromCol, toRow, toCol, board) || isValidBishopMove(fromRow, fromCol, toRow, toCol, board);
    case 'king':
      return isValidKingMove(fromRow, fromCol, toRow, toCol);
    default:
      return false;
  }
};

export const getValidMoves = (row: number, col: number, board: ChessBoard): [number, number][] => {
  const moves: [number, number][] = [];
  for (let toRow = 0; toRow < 8; toRow++) {
    for (let toCol = 0; toCol < 8; toCol++) {
      if (isValidMove(row, col, toRow, toCol, board)) {
        moves.push([toRow, toCol]);
      }
    }
  }
  return moves;
};
