export interface ChessPiece {
    type: Piece;
    color: Color;
    x: number;
    y: number;
    wasMoved: boolean;
}

export type Color = 'black' | 'white';
export type Piece = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';

const movementLogic: {
    [type: string]: (c: ChessPiece, l: LookupFn) => [number, number][];
} = {
    pawn: pawnLogic
};

export function getValidFields(
    activePiece: ChessPiece,
    lookup: LookupFn
): [number, number][] {
    return movementLogic[activePiece.type](activePiece, lookup);
}

export type LookupFn = (x: number, y: number) => ChessPiece | undefined;

function pawnLogic(pawn: ChessPiece, lookup: LookupFn): [number, number][] {
    const forward = (y: number, n: number) =>
        pawn.color === 'white' ? y - n : y + n;

    let result: [number, number][] = [];
    if (lookup(pawn.x, forward(pawn.y, 1)) === undefined) {
        result.push([pawn.x, forward(pawn.y, 1)]);
    }
    if (!pawn.wasMoved && lookup(pawn.x, forward(pawn.y, 2)) === undefined) {
        result.push([pawn.x, forward(pawn.y, 2)]);
    }
    for (const x of [pawn.x - 1, pawn.x + 1]) {
        if (x >= 0 && x < 8) {
            let enemy = lookup(x, forward(pawn.y, 1));
            if (enemy !== undefined && enemy.color !== pawn.color) {
                result.push([x, forward(pawn.y, 1)]);
            }
        }
    }
    return result;
}
