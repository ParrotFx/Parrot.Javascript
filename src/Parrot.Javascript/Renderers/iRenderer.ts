///<reference path="rendererProvider.ts" />
module Parrot.Renderers {
    export interface IRenderer {
        DefaultChildTag: string;
        Elements: string[];
        RendererProvider: RendererProvider;
        BeforeRender(statement: Statement, host: any[], model: any, rendererProvider: RendererProvider);
        Render(statement: Statement, host: any[], model: any, rendererProvider: RendererProvider): string;
        AfterRender(statement: Statement, host: any[], model: any, rendererProvider: RendererProvider);
    }
}