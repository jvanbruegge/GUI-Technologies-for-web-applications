import { LogicFunction, ChessPiece } from './piece';

export const pawnLogic: LogicFunction = (pawn, lookup) => {
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
};

export const rookLogic: LogicFunction = (rook, lookup) => {
    let result: [number, number][] = [];

    const jfns: ((i: number) => number)[] = [
        i => rook.x - i,
        i => rook.x + i,
        i => rook.y - i,
        i => rook.y + i
    ];

    const lookups: ((j: number) => ChessPiece | undefined)[] = [
        j => lookup(j, rook.y),
        j => lookup(rook.x, j)
    ];

    const toPush: (a: number, j: number) => [number, number] = (a, j) =>
        a < 2 ? [j, rook.y] : [rook.x, j];

    for (let a = 0; a < 4; a++) {
        for (let i = 1; i < 8; i++) {
            const j = jfns[a](i);
            if (j >= 0 && j < 8) {
                const l = lookups[Math.floor(a / 2)](j);
                if (l === undefined) {
                    result.push(toPush(a, j));
                } else {
                    if (l.color !== rook.color) {
                        result.push(toPush(a, j));
                    }
                    break;
                }
            }
        }
    }

    return result;
};
