import { inject } from '@aurelia/kernel';
import { bindable } from "@aurelia/runtime";
import { customElement } from '@aurelia/runtime';
import * as template from './viewport.html';
import { Router } from '../lib/router';


@inject(Router, Element)
@customElement({ name: 'viewport', template })
export class ViewportCustomElement {
  @bindable name: string;

  constructor(private router: Router, private element: Element) { }

  bound() {
    console.log('viewport bound', this.name, this.element);
    this.router.addViewport(this.name, this.element);
  }
}
