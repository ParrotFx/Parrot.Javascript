///<reference path="../parser.ts" />
///<reference path="./irenderer.ts" />
///<reference path="./rendererProvider.ts" />
///<reference path="../Infrastructure/ObjectModelValueProvider.ts" />
///<reference path="../Infrastructure/ValueTypeProvider.ts" />
///<reference path="../Infrastructure/exceptions.ts" />
///<reference path="./tagBuilder.ts" />
///<reference path="./baseRenderer.ts" />

module Parrot.Renderers {
    export class DocTypeRenderer extends BaseRenderer implements IRenderer {
        public DefaultChildTag: string = "div";
        public RendererProvider: RendererProvider;
        public Elements: string[] = ["doctype"];
        public Render(statement: Statement, host: any[], model: any, rendererProvider: RendererProvider): string {
            var value: string = "html";

            if (statement.Parameters.length > 0) {
                var localModel = this.GetLocalModelValue(host, statement, model);
                value = localModel;
            }

            return "<!DOCTYPE " + value + ">";
        }

        public AfterRender(statement: Statement, host: any[], model: any, rendererProvider: RendererProvider) { }
    }
}