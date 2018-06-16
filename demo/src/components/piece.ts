import { pawnLogic, rookLogic, bishopLogic, queenLogic } from './logic';

export interface ChessPiece {
    type: Piece;
    color: Color;
    x: number;
    y: number;
    wasMoved: boolean;
}

export type Color = 'black' | 'white';
export type Piece = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';

export type LookupFn = (x: number, y: number) => ChessPiece | undefined;
export type LogicFunction = (c: ChessPiece, l: LookupFn) => [number, number][];

const movementLogic: {
    [type: string]: LogicFunction;
} = {
    pawn: pawnLogic,
    rook: rookLogic,
    bishop: bishopLogic,
    queen: queenLogic
};

export function getValidFields(
    activePiece: ChessPiece,
    lookup: LookupFn
): [number, number][] {
    return movementLogic[activePiece.type](activePiece, lookup);
}
