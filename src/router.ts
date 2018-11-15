import { IHistoryEntry, HistoryBrowser } from './history-browser';
import { Viewport } from './viewport';

export interface IRoute {
    name: string;
    path: string;
    viewports: Object;
}

export interface IRouteViewport {
    name: string;
    component: any;
}

export class Router {
    public routes: IRoute[] = [];
    public viewports: Object = {};

    private options: any;
    private isActive: boolean = false;

    public historyBrowser: HistoryBrowser;

    constructor() {
        this.historyBrowser = new HistoryBrowser();
    }

    public activate(options?: Object): void {
        if (this.isActive) {
            throw new Error('Router has already been activated.');
        }

        this.isActive = true;
        this.options = Object.assign({}, {
            callback: (entry, flags) => {
                this.historyCallback(entry, flags);
            }
        }, options);

        this.historyBrowser.activate(this.options);
    }

    public historyCallback(entry: IHistoryEntry, flags: any) {
        if (this.options.reportCallback) {
            this.options.reportCallback(entry, flags);
        }

        const route: IRoute = this.findRoute(entry);
        if (!route) {
            return;
        }

        const viewports: Viewport[] = [];
        for (let vp in route.viewports) {
            let routeViewport: IRouteViewport = route.viewports[vp];
            let viewport = this.findViewport(vp);
            viewport.setNextContent(routeViewport.component);
            viewports.push(viewport);
        }

        this.renderViewports(viewports);
    }

    public findRoute(entry: IHistoryEntry): IRoute {
        return this.routes.find((value) => value.path === entry.path);
    }

    public findViewport(name: string): Viewport {
        return this.viewports[name];
    }

    public renderViewports(viewports: Viewport[]) {
        for (let viewport of viewports) {
            viewport.renderContent();
        }
    }

    public addViewport(name: string, element: any): void {
        this.viewports[name] = new Viewport(name, element);
    }

    public addRoute(route: IRoute) {
        this.routes.push(route);
    }
}
