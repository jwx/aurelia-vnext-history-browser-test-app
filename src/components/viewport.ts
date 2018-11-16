import { inject } from '@aurelia/kernel';
import { bindable, RenderPlan, DOM, createElement } from "@aurelia/runtime";
import { customElement } from '@aurelia/runtime';
import * as template from './viewport.html';
import { Router } from '../lib/router';


@inject(Router, Element)
@customElement({ name: 'viewport', template })
export class ViewportCustomElement {
  @bindable name: string;

  public loaded: boolean = false;
  public blockEnter: boolean = false;
  public blockLeave: boolean = false;

  public sub: RenderPlan = null;

  constructor(private router: Router, private element: Element) { }

  bound() {
    console.log('viewport bound', this.name, this.element, this.container);
    this.router.addViewport(this.name, this);
  }

  public load(content: string): Promise<boolean> {
    this.sub = createElement(content);
    this.loaded = true;
    return Promise.resolve(true);
  }

  public canEnter(): boolean {
    return !this.loaded || !this.blockEnter;
  }
  public canLeave(): boolean {
    return !this.loaded || !this.blockLeave;
  }
}
