import xs, { Stream } from 'xstream';
import { makeDOMDriver } from '@cycle/dom';
import { timeDriver } from '@cycle/time';
import onionify from 'cycle-onionify';

import { Component } from './interfaces';

// Set of Drivers used in this App
const drivers = {
    DOM: makeDOMDriver('#app'),
    time: timeDriver
};

export const driverNames = Object.keys(drivers)
    .concat(['onion']);

export function wrapMain(main: Component): Component {
    return onionify(main as any);
}
