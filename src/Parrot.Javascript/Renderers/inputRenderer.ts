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
    export class InputRenderer extends SelfClosingRenderer {
        DefaultChildTag: string = "";
        RendererProvider: RendererProvider;
        Elements: string[] = ["input"];

        public Render(statement: Statement, host: any[], model: any, rendererProvider: RendererProvider): string {
            //get the local model
            //var localModel = this.getLocalModelValue(host, statement, model);
            var type = this.getType(statement, host, model);
            switch (type) {
                case "checkbox":
                case "radio":
                    for (var i = 0; i < statement.Attributes.length; i++) {
                        var attribute = statement.Attributes[i];
                        if (attribute.Key == "checked") {
                            var value = this.RenderAttribute(attribute, host, model);
                            switch (value) {
                                case "true":
                                    statement.Attributes[i] = new Attribute(attribute.Key, new StringLiteral("\"checked\"", null, 0));
                                    break;
                                case "false":
                                case "null":
                                    statement.Attributes.splice(i, 1);
                                    i -= 1;
                                    break;
                            }
                        }
                    }
                    break;
            }

            return super.Render(statement, host, model, rendererProvider);
        }

        getType(statement: Statement, host: any[], model: any) {
            for (var i = 0; i < statement.Attributes.length; i++) {
                var attribute = statement.Attributes[i];
                if (attribute.Key == "type") {
                    return this.RenderAttribute(attribute, host, model);
                }
            }

            return "hidden";
        }
    }
}