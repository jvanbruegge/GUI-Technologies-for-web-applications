import xs, { Stream } from 'xstream';
import { VNode, td } from '@cycle/dom';
import { StateSource } from 'cycle-onionify';

import { BaseSources, BaseSinks } from '../interfaces';

import { ChessPiece } from './piece';

export interface Sources extends BaseSources {
    onion: StateSource<State>;
}
export interface Sinks extends BaseSinks {
    onion?: Stream<Reducer>;
}

export interface State {
    piece: ChessPiece | undefined;
}

export const defaultState = {};
export type Reducer = (prev?: State) => State | undefined;

export function Field({ onion }: Sources): Sinks {

    const display$: Stream<[VNode | string]> = onion.state$
        .map<any>(({ piece }) => piece === undefined ? [''] : [
            <img
                src={ `/pieces/${piece.type}_${piece.color}.svg` }
                alt={ piece.type }
            />
        ]);

    return {
        DOM: display$.map(td)
    };
}
