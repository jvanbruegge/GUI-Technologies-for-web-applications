import xs, { Stream } from 'xstream';
import { VNode, DOMSource } from '@cycle/dom';
import { StateSource } from 'cycle-onionify';
import isolate from '@cycle/isolate';
import { extractSinks } from 'cyclejs-utils';

import { driverNames } from '../drivers';
import { BaseSources, BaseSinks } from '../interfaces';

export interface Sources extends BaseSources {
    onion: StateSource<State>;
}
export interface Sinks extends BaseSinks {
    onion?: Stream<Reducer>;
}

export interface State {
}
export const defaultState: State = {
};
export type Reducer = (prev?: State) => State | undefined;

export function App(sources: Sources): Sinks {
    const initReducer$ = xs.of<Reducer>(() => defaultState);

    return {
        onion: initReducer$
    };
}
