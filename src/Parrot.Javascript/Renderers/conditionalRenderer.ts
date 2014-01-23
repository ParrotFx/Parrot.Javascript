///<reference path="../parser.ts" />
///<reference path="./irenderer.ts" />
///<reference path="./rendererProvider.ts" />
///<reference path="../Infrastructure/ObjectModelValueProvider.ts" />
///<reference path="../Infrastructure/ValueTypeProvider.ts" />
///<reference path="../Infrastructure/exceptions.ts" />
///<reference path="./tagBuilder.ts" />
///<reference path="./baseRenderer.ts" />
///<reference path="./selfClosingRenderer.ts" />
///<reference path="./stringRenderer.ts" />

module Parrot.Renderers {
    export class ConditionalRenderer extends HtmlRenderer {
        public Elements: string[] = ["conditional"];

        public Render(statement: Statement, host: any[], model: any, rendererProvider: RendererProvider): string {
            this.RendererProvider = rendererProvider;
            //get the local model
            //var localModel = this.getLocalModelValue(host, statement, model);
            var localModel = this.GetLocalModelValue(host, statement, model);

            var statementToOutput = "default";

            if (localModel != null) {
                statementToOutput = localModel.ToString();
            }

            for (var i in statement.Children) {
                var child = statement.Children[i];
                var value = "";

                var renderer = rendererProvider.getRenderer(child.Name);
                if (renderer instanceof StringRenderer) {
                    value = renderer.render(child, host, model, rendererProvider);
                } else {
                    value = child.Name;
                }

                if (value == statementToOutput) {
                    return this.RenderChildren(child, host, model, this.DefaultChildTag);
                }

                for (var i in statement.Children) {
                    var child = statement.Children[i];
                    if (child.Name == "default") {
                        return this.RenderChildren(child, host, model, this.DefaultChildTag);
                    }
                }
            }
        }
    }
}