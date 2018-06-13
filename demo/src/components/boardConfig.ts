import { State as FieldState, defaultState } from './field';
import { ChessPiece, Color } from './piece';

const pawnRow: (c: Color) => FieldState[] = color =>
    Array(8).fill({
        piece: { type: 'pawn', color }
    });

const backRow: (c: Color) => FieldState[] = color => [
    { piece: { type: 'rook', color } },
    { piece: { type: 'knight', color } },
    { piece: { type: 'bishop', color } },
    { piece: { type: 'queen', color } },
    { piece: { type: 'king', color } },
    { piece: { type: 'bishop', color } },
    { piece: { type: 'knight', color } },
    { piece: { type: 'rook', color } }
];

export const defaultBoard: FieldState[][] = [backRow('black'), pawnRow('black')]
    .concat(Array(4).fill(Array(8).fill(defaultState)))
    .concat([pawnRow('white'), backRow('white')]);
