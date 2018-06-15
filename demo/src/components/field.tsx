import xs, { Stream } from 'xstream';
import sampleCombine from 'xstream/extra/sampleCombine';
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
    piece?: ChessPiece;
    activePiece: [number, number] | undefined;
    highlighted: boolean;
    x: number;
    y: number;
}
export type Reducer = (prev: State) => State | undefined;

export function Field({ onion, DOM }: Sources): Sinks {
    const selectPiece$: Stream<Reducer> = DOM.events('click')
        .compose(sampleCombine(onion.state$))
        .map(([_, s]) => s)
        .filter(({ piece }) => piece !== undefined)
        .mapTo<Reducer>(prev => ({ ...prev, activePiece: [prev.x, prev.y] }));

    const vdom$: Stream<VNode> = onion.state$
        .map<any>(state => {
            const { piece } = state;
            const vdom =
                piece === undefined ? (
                    ''
                ) : (
                    <img
                        src={`/pieces/${piece.type}_${piece.color}.svg`}
                        alt={piece.type}
                    />
                );

            return [vdom, state];
        })
        .map(([child, { activePiece, x, y, highlighted }]) => (
            <td
                class-isActive={
                    activePiece && activePiece[0] === x && activePiece[1] === y
                }
                class-highlight={highlighted}
            >
                {child}
            </td>
        ));

    return {
        DOM: vdom$,
        onion: selectPiece$
    };
}
