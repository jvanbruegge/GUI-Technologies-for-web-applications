import { setup, run } from '@cycle/run';
import isolate from '@cycle/isolate';

import { drivers, wrapMain } from './drivers';
import { Component } from './interfaces';
import { App } from './components/app';

const main: Component = wrapMain(App);

run(main as any, drivers);
