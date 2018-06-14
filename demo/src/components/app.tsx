import xs, { Stream } from 'xstream';
import { VNode, DOMSource, tr, table } from '@cycle/dom';
import { StateSource, makeCollection } from 'cycle-onionify';
import isolate from '@cycle/isolate';
import { pickMergeSinks, mergeSinks } from 'cyclejs-utils';

import { driverNames } from '../drivers';
import { BaseSources, BaseSinks } from '../interfaces';

import { defaultPieces, boardLens } from './boardConfig';
import { ChessPiece } from './piece';

import {
    State as FieldState,
    defaultState as defaultFieldState,
    Field
} from './field';

export interface Sources extends BaseSources {
    onion: StateSource<State>;
}
export interface Sinks extends BaseSinks {
    onion?: Stream<Reducer>;
}

export interface State {
    pieces: ChessPiece[];
    activePiece: [number, number] | undefined;
}
export const defaultState: State = {
    pieces: defaultPieces,
    activePiece: undefined
};
export type Reducer = (prev?: State) => State | undefined;

const FieldRow = makeCollection({
    item: Field,
    itemKey: (_, i) => 'field' + i,
    collectSinks: pickMergeSinks(driverNames, {
        DOM: ins => ins.pickCombine('DOM').map(tr)
    }) as any
});

const Board = makeCollection({
    item: FieldRow,
    itemKey: (_, i) => 'row' + i,
    collectSinks: pickMergeSinks(driverNames, {
        DOM: ins => ins.pickCombine('DOM').map(table)
    }) as any
});

export function App(sources: Sources): Sinks {
    const initReducer$ = xs.of<Reducer>(() => defaultState);

    const boardSinks = isolate(Board, {
        onion: boardLens,
        '*': 'fields'
    })(sources);

    const sinks = {
        onion: initReducer$
    };

    return mergeSinks([sinks, boardSinks]);
}
