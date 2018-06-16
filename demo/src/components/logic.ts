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

                if (pos[0] >= 0 && pos[0] < 8 && pos[1] >= 0 && pos[1] < 8) {
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
