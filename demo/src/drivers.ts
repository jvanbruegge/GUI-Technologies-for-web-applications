import xs, { Stream } from 'xstream';
import { makeDOMDriver } from '@cycle/dom';
import { timeDriver } from '@cycle/time';
import onionify from 'cycle-onionify';

import { Component } from './interfaces';

export const drivers = {
    DOM: makeDOMDriver('#app'),
    Time: timeDriver,
    eventDispatch
};

export const driverNames = Object.keys(drivers).concat(['onion']);

export function wrapMain(main: Component): Component {
    return onionify(main as any);
}

function eventDispatch(sink$: Stream<[Element, Event]>): void {
    sink$.addListener({
        next: ([el, ev]) => el.dispatchEvent(ev)
    });
}
