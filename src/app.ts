import { Router } from './router';
import { customElement } from '@aurelia/runtime';
import * as template from './app.html';
import { HistoryBrowser } from './history-browser';

@customElement({ name: 'app', template })
export class App {
  message = 'So... we meet again, Mr. World!';
  public output: string = '';
  public title: string = '';

  private left: any;
  private right: any;

  private router: Router;

  constructor() {
    this.router = new Router();

    this.router.activate({
      reportCallback: (entry, flags) => {
        this.pathCallback(entry, flags);
      }
    });
    this.router.addRoute({ name: 'abc', path: '/test/abc', viewports: { 'left': { component: 'abc-component' }, 'right': { component: 'abc-component'} } });
    this.router.addRoute({ name: 'def', path: '/test/def', viewports: { 'left': { component: 'def-component' }, 'right': { component: 'def-component'} } });
    this.router.addRoute({ name: 'abc-left', path: '/test/abc-left', viewports: { 'left': { component: 'abc-component' } } });
    this.router.addRoute({ name: 'abc-right', path: '/test/abc-right', viewports: { 'right': { component: 'abc-component' } } });
  }

  attached() {
    console.log('ATTACHED', (<any>this).left);
    this.router.addViewport("left", this.left);
    this.router.addViewport("right", this.right);
  }

  pathCallback(entry, flags) {
    console.log('app callback', entry, flags, this.title);
    this.output += `Path: ${entry.path} [${entry.index}] "${entry.title}" (${this.stringifyFlags(flags)}) ${JSON.stringify(entry.data)}\n`;
    this.title = this.router.historyBrowser.titles.join(' > ');
    if (!entry.title) {
      setTimeout(() => {
        this.router.historyBrowser.setEntryTitle(entry.path.split('/').pop() + ' (async)');
        this.title = this.router.historyBrowser.titles.join(' > ');
      }, 500);
    }
  }

  stringifyFlags(flags) {
    let outs = [];
    for (let flag in flags) {
      outs.push(flag.replace('is', ''));
    }
    return outs.join(',');
  }

  clickAbc() {
    this.router.historyBrowser.goto('/test/abc', 'first', { id: 123 });
  }
  clickAbcLeft() {
    this.router.historyBrowser.goto('/test/abc-left', 'first-left', { id: '123L' });
  }
  clickAbcRight() {
    this.router.historyBrowser.goto('/test/abc-right', 'first-right', { id: '123R' });
  }
  clickDef() {
    this.router.historyBrowser.goto('/test/def', 'second', { id: 456 });
  }
  clickReplace() {
    this.router.historyBrowser.replace('/test/xyz', 'last', { id: 999 });
  }
  clickBack() {
    this.router.historyBrowser.back();
  }
  clickForward() {
    this.router.historyBrowser.forward();
  }
  clickBack2() {
    this.router.historyBrowser.history.go(-2);
  }
  clickForward2() {
    this.router.historyBrowser.history.go(2);
  }
  clickCancel() {
    this.router.historyBrowser.cancel();
  }
  clickRefresh() {
    this.router.historyBrowser.refresh();
  }
}
