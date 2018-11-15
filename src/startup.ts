import { DI } from '@aurelia/kernel';
import { BasicConfiguration } from '@aurelia/jit';
import { Aurelia, CustomElementResource } from '@aurelia/runtime';
import { App } from './app';
import { ViewportCustomElement } from './components/viewport';

const container = DI.createContainer();
container.register(BasicConfiguration, <any>ViewportCustomElement, <any>App);
const component = container.get(CustomElementResource.keyFrom('app'));

const au = new Aurelia(container);
au.app({ host: document.querySelector('app'), component });
au.start();
