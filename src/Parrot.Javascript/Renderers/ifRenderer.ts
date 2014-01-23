///<reference path="../parser.ts" />
///<reference path="./irenderer.ts" />
///<reference path="./rendererProvider.ts" />
///<reference path="../Infrastructure/ObjectModelValueProvider.ts" />
///<reference path="../Infrastructure/ValueTypeProvider.ts" />
///<reference path="../Infrastructure/exceptions.ts" />
///<reference path="./tagBuilder.ts" />
///<reference path="./baseRenderer.ts" />
///<reference path="./selfClosingRenderer.ts" />

module Parrot.Renderers {
    export class IfRenderer extends HtmlRenderer {
        DefaultChildTag: string = "";
        RendererProvider: RendererProvider;
        Elements: string[] = ["if"];

        public Render(statement: Statement, host: any[], model: any, rendererProvider: RendererProvider): string {
            this.RendererProvider = rendererProvider;
            //get the local model
            //var localModel = this.getLocalModelValue(host, statement, model);
            var localModel = this.GetLocalModelValue(host, statement, model);

            if (localModel != null && localModel == true) {
                return this.RenderChildren(statement, host, model, this.DefaultChildTag);
            }
        }
    }
}