import xs, { Stream } from 'xstream';
import sampleCombine from 'xstream/extra/sampleCombine';
import { VNode, DOMSource, td } from '@cycle/dom';
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
    const { selectPiece$, movePiece$ } = intent(DOM, onion.state$);

    return {
        DOM: view(onion.state$),
        onion: selectPiece$,
        eventDispatch: movePiece$
    };
}

interface Intent {
    selectPiece$: Stream<Reducer>;
    movePiece$: Stream<[Element, Event]>;
}

function intent(DOM: DOMSource, state$: Stream<State>): Intent {
    const event$: Stream<[Event, State]> = DOM.events('click').compose(
        sampleCombine(state$)
    );

    const selectPiece$: Stream<Reducer> = event$
        .filter(
            ([_, { piece, activePiece }]) =>
                piece !== undefined && activePiece === undefined
        )
        .mapTo<Reducer>(prev => ({ ...prev, activePiece: [prev.x, prev.y] }));

    const movePiece$: Stream<[Element, Event]> = event$
        .filter(([_, { highlighted }]) => highlighted)
        .map(
            ([ev, { x, y }]) =>
                [
                    ev.currentTarget as Element,
                    new CustomEvent('pieceMove', {
                        detail: [x, y],
                        bubbles: true
                    })
                ] as [Element, Event]
        );

    return { selectPiece$, movePiece$ };
}

function view(state$: Stream<State>): Stream<VNode> {
    return state$
        .map<any>(state => {
            const { piece } = state;
            const vdom =
                piece === undefined ? (
                    <span />
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
}
