export interface ChessPiece {
    type: Piece;
    color: Color;
    x: number;
    y: number;
}

export type Color = 'black' | 'white';
export type Piece = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';
