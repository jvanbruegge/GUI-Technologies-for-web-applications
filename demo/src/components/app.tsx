import xs, { Stream } from 'xstream';
import { StateSource } from 'cycle-onionify';
import isolate from '@cycle/isolate';
import { mergeSinks } from 'cyclejs-utils';

import { BaseSources, BaseSinks } from '../interfaces';

import { defaultPieces } from './boardConfig';
import { ChessPiece } from './piece';
import { Board } from './board';

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
export type Reducer = (prev: State) => State | undefined;

export function App(sources: Sources): Sinks {
    const initReducer$ = xs.of<Reducer>(() => defaultState);

    const resetSelection$ = sources.DOM.events('click').mapTo<Reducer>(
        prev => ({ ...prev, activePiece: undefined })
    );

    const boardSinks = isolate(Board, {
        onion: null,
        '*': 'fields'
    })(sources);

    const sinks = {
        onion: xs.merge(initReducer$, resetSelection$)
    };

    return mergeSinks([sinks, boardSinks]);
}
