///<reference path="../parser.ts" />
///<reference path="./irenderer.ts" />
///<reference path="rendererProvider.ts" />
///<reference path="../Infrastructure/ObjectModelValueProvider.ts" />
///<reference path="../Infrastructure/ValueTypeProvider.ts" />
///<reference path="../Infrastructure/exceptions.ts" />
///<reference path="./htmlRenderer.ts" />

module Parrot.Renderers {
    export class SelfClosingRenderer extends HtmlRenderer {
        DefaultChildTag: string = "";
        RendererProvider: RendererProvider;
        Elements: string[] = ["base", "basefont", "frame", "link", "meta", "area", "br", "col", "hr", "img", "param"];

        public Render(statement: Statement, host: any[], model: any, rendererProvider: RendererProvider): string {
            //get the local model
            var localModel = this.GetLocalModelValue(host, statement, model);

            return this.CreateTag(statement, host, localModel);
        }

        private createTag(statement: Statement, host: any[], model: any): string {
            var tagName: string = statement.Name == null || statement.Name.length == 0 ? this.DefaultChildTag : statement.Name;
            var builder = new TagBuilder(tagName);
            this.RenderAttributes(host, model, statement, builder);

            return builder.toString(TagRenderMode.SelfClosing);
        }
    }
}