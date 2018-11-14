interface IHistoryEntry {
    path: string;
    index?: number;
    title?: string;
    data?: Object;
}

interface INavigationFlags {
    isFirst?: boolean;
    isNew?: boolean;
    isRefresh?: boolean;
    isForward?: boolean;
    isBack?: boolean;
    isCancel?: boolean;
}

export class HistoryBrowser {
    public currentEntry: IHistoryEntry;
    public historyEntries: IHistoryEntry[] = [];

    private activeEntry: IHistoryEntry = null;

    private location: any;
    public history: any;

    private options: any;

    private isActive: boolean = false;

    private lastHistoryMovement: number;
    private isCancelling: boolean = false;

    private __path: string; // For development, should be removed

    constructor() {
        this.location = window.location;
        this.history = window.history;
    }

    public activate(options?: Object): void {
        if (this.isActive) {
            throw new Error('History has already been activated.');
        }

        this.isActive = true;
        this.options = Object.assign({}, options);

        window.addEventListener('popstate', this.pathChanged);
        // window.onpopstate = this.pathChanged;
        // window.onpopstate = function (event) {
        //   console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
        // };

        this.pathChanged();
    }

    public deactivate(): void {
        window.removeEventListener('popstate', this.pathChanged);
        this.isActive = false;
    }

    public goto(path: string, title?: string, data?: Object): void {
        this.activeEntry = {
            path: path,
            title: title,
            data: data,
        };
        this.setPath(path);
        // this.pathChanged();
    }

    public back(): void {
        this.history.go(-1);
    }

    public forward(): void {
        this.history.go(1);
    }

    public cancel(): void {
        this.isCancelling = true;
        this.history.go(-this.lastHistoryMovement);
    }

    public setState(key: string, value: any): void {
        const state = Object.assign({}, this.history.state);
        const { pathname, search, hash } = this.location;
        state[key] = JSON.parse(JSON.stringify(value));
        this.history.replaceState(state, null, `${pathname}${search}${hash}`);
    }

    public getState(key: string): any {
        const state = Object.assign({}, this.history.state);
        return state[key];
    }

    public setEntryTitle(title: string) {
        this.currentEntry.title = title;
        this.historyEntries[this.currentEntry.index] = this.currentEntry;
        this.setState('HistoryEntries', this.historyEntries);
        this.setState('HistoryEntry', this.currentEntry);
    }

    get titles(): string[] {
        return this.historyEntries.map((value) => value.title);
    }

    private pathChanged = (): void => {
        const path: string = this.getPath();
        console.log('path changed to', path, this.activeEntry);

        const navigationFlags: INavigationFlags = {};

        if (this.activeEntry && this.activeEntry.path === path) { // Only happens with new history entries
            navigationFlags.isNew = true;
            this.lastHistoryMovement = 1;
            const historyEntry: IHistoryEntry = this.getState('HistoryEntry');
            if (!historyEntry) {
                navigationFlags.isNew = true;
            }
            this.currentEntry = this.activeEntry;
            this.currentEntry.index = this.historyEntries.length;
            this.historyEntries.push(this.currentEntry);
            this.setState('HistoryEntries', this.historyEntries);
            this.setState('HistoryEntry', this.currentEntry);
        } else { // Refresh, history navigation, first navigation, manual navigation or cancel
            this.historyEntries = this.getState('HistoryEntries') || this.historyEntries || [];
            let historyEntry: IHistoryEntry = this.getState('HistoryEntry');
            if (!historyEntry && !this.currentEntry) {
                navigationFlags.isNew = true;
                navigationFlags.isFirst = true;
            } else if (!historyEntry) {
                navigationFlags.isNew = true;
            } else if (!this.currentEntry) {
                navigationFlags.isRefresh = true;
            } else if (this.currentEntry.index < historyEntry.index) {
                navigationFlags.isForward = true;
            } else if (this.currentEntry.index > historyEntry.index) {
                navigationFlags.isBack = true;
            }

            if (!historyEntry) {
                historyEntry = {
                    path: path,
                    index: this.historyEntries.length,
                };
                this.historyEntries.push(historyEntry);
                this.setState('HistoryEntries', this.historyEntries);
                this.setState('HistoryEntry', historyEntry);
            }
            this.lastHistoryMovement = (this.currentEntry ? historyEntry.index - this.currentEntry.index : 0);
            this.currentEntry = historyEntry;

            if (this.isCancelling) {
                navigationFlags.isCancel = true;
                this.isCancelling = false;
                // Prevent another cancel by clearing lastHistoryMovement?
            }
        }
        this.activeEntry = null;

        console.log('navigated', this.getState('HistoryEntry'), this.getState('HistoryEntries'));
        this.callback(this.currentEntry, navigationFlags);
    }

    private getPath(): string {
        return this.location.hash.substr(1);
        // return this.__path;
    }
    private setPath(path: string): void {
        this.location.hash = path;
    }
    private callback(currentEntry: Object, navigationFlags: INavigationFlags) {
        console.log('callback', currentEntry, navigationFlags);
        if (this.options.callback) {
            this.options.callback(currentEntry, navigationFlags);
        }
    }
}
