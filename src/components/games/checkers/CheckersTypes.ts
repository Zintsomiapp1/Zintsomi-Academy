
export type PieceType = 'regular' | 'king';
export type PieceColor = 'red' | 'black';
export type GameStatus = 'playing' | 'red-wins' | 'black-wins' | 'draw';

export interface CheckersPiece {
  type: PieceType;
  color: PieceColor;
}

export type CheckersBoard = (CheckersPiece | null)[][];

export interface CheckersMove {
  from: [number, number];
  to: [number, number];
  isCapture: boolean;
}
