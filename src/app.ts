import { customElement } from '@aurelia/runtime';
import * as template from './app.html';
import { HistoryBrowser } from './history-browser';

@customElement({ name: 'app', template })
export class App {
  message = 'So... we meet again, Mr. World!';
  public output: string = '';
  public title: string = '';

  private historyBrowser: HistoryBrowser;
  constructor() {
    this.historyBrowser = new HistoryBrowser();
    this.historyBrowser.activate({
      callback: (entry, flags) => {
        this.pathCallback(entry, flags)
          ;
      }
    });
  }

  pathCallback(entry, flags) {
    console.log('app callback', entry, flags, this.title);
    this.output += `Path: ${entry.path} [${entry.index}] "${entry.title}" (${this.stringifyFlags(flags)}) ${JSON.stringify(entry.data)}\n`;
    this.title = this.historyBrowser.titles.join(' > ');
    if (!entry.title) {
      setTimeout(() => {
        this.historyBrowser.setEntryTitle(entry.path.split('/').pop() + ' (async)');
        this.title = this.historyBrowser.titles.join(' > ');
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
    this.historyBrowser.goto('/test/abc', 'first', { id: 123 });
  }
  clickDef() {
    this.historyBrowser.goto('/test/def', 'second', { id: 456 });
  }
  clickBack() {
    this.historyBrowser.back();
  }
  clickForward() {
    this.historyBrowser.forward();
  }
  clickBack2() {
    this.historyBrowser.history.go(-2);
  }
  clickForward2() {
    this.historyBrowser.history.go(2);
  }
  clickCancel() {
    this.historyBrowser.cancel();
  }
}
