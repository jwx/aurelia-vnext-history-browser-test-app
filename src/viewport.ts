export class Viewport {
    public content: string;
    public nextContent: string;

    constructor(public name: string, public element: any) {
    }

    public canLeave(): Promise<boolean> {
        return Promise.resolve(true);
    }

    public setNextContent(content: string): Promise<boolean> {
        this.nextContent = content;
        return Promise.resolve(true);
    }

    public renderContent() {
        console.log('Rendering', this.name, this.nextContent);
        this.element.innerHTML = this.nextContent;
        this.content = this.nextContent;
    }
}
