///<reference path="rendererProvider.ts" />
interface IRenderer {
    defaultChildTag: string;
    elements: string[];
    rendererProvider: RendererProvider;
    beforeRender(statement: Statement, host: any[], model: any, rendererProvider: RendererProvider);
    render(statement: Statement, host: any[], model: any, rendererProvider: RendererProvider);
    afterRender(statement: Statement, host: any[], model: any, rendererProvider: RendererProvider);
}