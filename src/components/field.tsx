import xs, { Stream } from 'xstream';
import { StateSource } from 'cycle-onionify';

import { BaseSources, BaseSinks } from '../interfaces';

export interface Sources extends BaseSources {
    onion: StateSource<State>;
}
export interface Sinks extends BaseSinks {
    onion?: Stream<Reducer>;
}

export interface State {}

export const defaultState = {};
export type Reducer = (prev?: State) => State | undefined;

export function Field(sources: Sources): Sinks {
    return {
        DOM: xs.of(<td>Test</td>)
    };
}
