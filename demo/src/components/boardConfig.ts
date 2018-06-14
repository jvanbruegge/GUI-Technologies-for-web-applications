import { Lens } from 'cycle-onionify';

import { State as FieldState, defaultState } from './field';
import { ChessPiece, Color } from './piece';
import { State as AppState } from './app';

const pawns: (c: Color, y: number) => ChessPiece[] = (color, y) =>
    Array(8)
        .fill(null)
        .map<ChessPiece>((_, i) => ({
            color,
            type: 'pawn',
            x: i,
            y
        }));

const others: (c: Color, y: number) => ChessPiece[] = (color, y) => [
    { color, type: 'rook', x: 0, y },
    { color, type: 'knight', x: 1, y },
    { color, type: 'bishop', x: 2, y },
    { color, type: 'queen', x: 3, y },
    { color, type: 'king', x: 4, y },
    { color, type: 'bishop', x: 5, y },
    { color, type: 'knight', x: 6, y },
    { color, type: 'rook', x: 7, y }
];

export const defaultPieces = others('black', 0)
    .concat(pawns('black', 1))
    .concat(pawns('white', 6))
    .concat(others('white', 7));

export const boardLens: Lens<AppState, FieldState[][]> = {
    get: ({ pieces, activePiece }: AppState) => {
        const emptyBoard = Array(8).fill(Array(8).fill({}))
            .map((arr, y) => arr.map((_, x) => ({ ...defaultState, x, y })));

        pieces.forEach(p => {
            emptyBoard[p.y][p.x].piece = p;
        });

        return emptyBoard;
    },
    set: x => x
};
