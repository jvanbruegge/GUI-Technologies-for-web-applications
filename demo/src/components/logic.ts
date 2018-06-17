import { LogicFunction, ChessPiece } from './piece';

export const pawnLogic: LogicFunction = (pawn, lookup) => {
    const forward = (n: number) =>
        pawn.color === 'white' ? pawn.y - n : pawn.y + n;

    let result: [number, number][] = [];

    if (onBoard(forward(1))) {
        if (lookup(pawn.x, forward(1)) === undefined) {
            result.push([pawn.x, forward(1)]);
        }
        for (const x of [pawn.x - 1, pawn.x + 1]) {
            if (onBoard(x)) {
                let enemy = lookup(x, forward(1));
                if (enemy !== undefined && enemy.color !== pawn.color) {
                    result.push([x, forward(1)]);
                }
            }
        }
    }
    if (!pawn.wasMoved && lookup(pawn.x, forward(1)) === undefined && lookup(pawn.x, forward(2)) === undefined) {
        result.push([pawn.x, forward(2)]);
    }

    return result;
};

export const knightLogic: LogicFunction = (piece, lookup) => {
    let result: [number, number][] = [];

    const check: (x: number, y: number) => void = (x, y) => {
        if (onBoard(x) && onBoard(y)) {
            const l = lookup(x, y);
            if (l === undefined || l.color !== piece.color) {
                result.push([x, y]);
            }
        }
    };

    for (let y of [piece.y + 2, piece.y - 2]) {
        for (let x of [piece.x - 1, piece.x + 1]) {
            check(x, y);
        }
    }

    for (let y of [piece.y + 1, piece.y - 1]) {
        for (let x of [piece.x + 2, piece.x - 2]) {
            check(x, y);
        }
    }

    return result;
};

export const kingLogic: LogicFunction = (piece, lookup) => {
    let result: [number, number][] = [];

    for (let i of [-1, 0, 1]) {
        for (let j of [-1, 0, 1]) {
            const x = piece.x + i;
            const y = piece.y + j;
            if (onBoard(x) && onBoard(y)) {
                const l = lookup(x, y);
                if (l === undefined || l.color !== piece.color) {
                    result.push([x, y]);
                }
            }
        }
    }

    return result;
};

export const bishopLogic: LogicFunction = straightLogic((piece, i, dir) => {
    switch (dir) {
        case 0:
            return [piece.x + i, piece.y + i];
        case 1:
            return [piece.x + i, piece.y - i];
        case 2:
            return [piece.x - i, piece.y + i];
        default:
            return [piece.x - i, piece.y - i];
    }
});

export const rookLogic: LogicFunction = straightLogic((piece, i, dir) => {
    switch (dir) {
        case 0:
            return [piece.x + i, piece.y];
        case 1:
            return [piece.x - i, piece.y];
        case 2:
            return [piece.x, piece.y + i];
        default:
            return [piece.x, piece.y - i];
    }
});

export const queenLogic: LogicFunction = (piece, lookup) => {
    return bishopLogic(piece, lookup).concat(rookLogic(piece, lookup));
};

function straightLogic(
    nextPos: (piece: ChessPiece, i: number, dir: number) => [number, number]
): LogicFunction {
    return (piece, lookup) => {
        let result: [number, number][] = [];

        for (let dir = 0; dir < 4; dir++) {
            for (let i = 1; i < 8; i++) {
                const pos = nextPos(piece, i, dir);

                if (onBoard(pos[0]) && onBoard(pos[1])) {
                    const l = lookup(pos[0], pos[1]);
                    if (l === undefined) {
                        result.push(pos);
                    } else {
                        if (l.color !== piece.color) {
                            result.push(pos);
                        }
                        break;
                    }
                }
            }
        }

        return result;
    };
}

function onBoard(n: number): boolean {
    return n >= 0 && n < 8;
}
