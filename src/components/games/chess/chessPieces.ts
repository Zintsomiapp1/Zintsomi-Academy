
export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
export type PieceColor = 'white' | 'black';

export interface ChessPiece {
  type: PieceType;
  color: PieceColor;
}

export type ChessBoard = (ChessPiece | null)[][];

export const getPieceSymbol = (piece: ChessPiece): string => {
  const symbols = {
    white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
    black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' }
  };
  return symbols[piece.color][piece.type];
};

export const initializeBoard = (): ChessBoard => {
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
