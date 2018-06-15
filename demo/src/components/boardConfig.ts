import { Lens } from 'cycle-onionify';
const deepEqual = require('deep-equal');

import { State as FieldState } from './field';
import { ChessPiece, Color, LookupFn, getValidFields } from './piece';
import { State as AppState } from './app';

const pawns: (c: Color, y: number) => ChessPiece[] = (color, y) =>
    Array(8)
        .fill(null)
        .map<ChessPiece>((_, i) => ({
            color,
            type: 'pawn',
            x: i,
            y,
            wasMoved: false
        }));

const others: (c: Color, y: number) => ChessPiece[] = (color, y) => [
    { color, type: 'rook', x: 0, y, wasMoved: false },
    { color, type: 'knight', x: 1, y, wasMoved: false },
    { color, type: 'bishop', x: 2, y, wasMoved: false },
    { color, type: 'queen', x: 3, y, wasMoved: false },
    { color, type: 'king', x: 4, y, wasMoved: false },
    { color, type: 'bishop', x: 5, y, wasMoved: false },
    { color, type: 'knight', x: 6, y, wasMoved: false },
    { color, type: 'rook', x: 7, y, wasMoved: false }
];

export const defaultPieces = others('black', 0)
    .concat(pawns('black', 1))
    .concat(pawns('white', 6))
    .concat(others('white', 7));

export const boardLens: Lens<AppState, FieldState[][]> = {
    get: ({ pieces, activePiece }: AppState) => {
        let emptyBoard: FieldState[][] = [];

        for (let y = 0; y < 8; y++) {
            let row: FieldState[] = [];
            for (let x = 0; x < 8; x++) {
                row.push({
                    x,
                    y,
                    activePiece,
                    highlighted: false
                });
            }
            emptyBoard.push(row);
        }

        pieces.forEach(p => {
            emptyBoard[p.y][p.x].piece = p;
        });

        if (activePiece !== undefined) {
            const lookup: LookupFn = (x, y) => emptyBoard[y][x].piece;
            const validFields = getValidFields(
                lookup(activePiece[0], activePiece[1]) as ChessPiece,
                lookup
            );

            for (const [x, y] of validFields) {
                emptyBoard[y][x].highlighted = true;
            }
        }

        return emptyBoard;
    },
    set: (state: AppState, boardState: FieldState[][]) => {
        let newState = { ...state };

        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                if (
                    !deepEqual(state.activePiece, boardState[y][x].activePiece)
                ) {
                    newState.activePiece = boardState[y][x].activePiece;
                    break;
                }
            }
        }

        return newState;
    }
};
