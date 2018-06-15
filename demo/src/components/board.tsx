import { Stream } from 'xstream';
import isolate from '@cycle/isolate';
import { tr, table, DOMSource } from '@cycle/dom';
import { makeCollection } from 'cycle-onionify';
import { pickMergeSinks, mergeSinks } from 'cyclejs-utils';

import { State, Sources, Sinks, Reducer } from './app';
import { driverNames } from '../drivers';
import { Field } from './field';
import { boardLens } from './boardConfig';
import { ChessPiece } from './piece';

const FieldRow = makeCollection({
    item: Field,
    itemKey: (_, i) => 'field' + i,
    itemScope: key => ({ onion: null, '*': '.' + key }),
    collectSinks: pickMergeSinks(driverNames, {
        DOM: ins => ins.pickCombine('DOM').map(tr)
    }) as any
});

const InnerBoard = makeCollection({
    item: FieldRow,
    itemKey: (_, i) => 'row' + i,
    itemScope: key => ({ onion: null, '*': '.' + key }),
    collectSinks: pickMergeSinks(driverNames, {
        DOM: ins => ins.pickCombine('DOM').map(table)
    }) as any
});

export function Board(sources: Sources): Sinks {
    const { DOM, onion, Time } = sources;

    const boardSinks = isolate(InnerBoard, {
        onion: boardLens,
        '*': '.board'
    })(sources);

    const movePiece$: Stream<Reducer> = DOM.events('pieceMove')
        .compose(Time.throttle(50))
        .map((ev: CustomEvent) => ev.detail)
        .map<Reducer>(([x, y]) => prev => {
            const piece: ChessPiece = prev.pieces.reduce(
                (a, c) =>
                    prev.activePiece &&
                    c.x === prev.activePiece[0] &&
                    c.y === prev.activePiece[1]
                        ? c
                        : a
            );

            const newPieces = prev.pieces
                .filter(p => p.x !== piece.x || p.y !== piece.y)
                .filter(p => p.x !== x || p.y !== y)
                .concat({
                    ...piece,
                    wasMoved: true,
                    x,
                    y
                });

            return {
                pieces: newPieces,
                activePiece: undefined
            };
        });

    const sinks = {
        onion: movePiece$
    };

    return mergeSinks([sinks, boardSinks]);
}
