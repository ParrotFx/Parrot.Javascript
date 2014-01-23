///<reference path="../parser.ts" />
///<reference path="./irenderer.ts" />
///<reference path="rendererProvider.ts" />
///<reference path="../Infrastructure/ObjectModelValueProvider.ts" />
///<reference path="../Infrastructure/ValueTypeProvider.ts" />
///<reference path="../Infrastructure/exceptions.ts" />

module Parrot.Renderers {
    export class StringRenderer implements IRenderer {
        public DefaultChildTag: string = "";
        public RendererProvider: RendererProvider;
        public Elements: string[] = ["string"];

        public Render(statement: Statement, host: any[], model: any, rendererProvider: RendererProvider): string {
            //get the local model
            this.RendererProvider = rendererProvider;
            var result: string = "";
            if (statement instanceof StringLiteral) {
                var values = (<StringLiteral>statement).Values
            for (var i in values) {
                    result += this.GetModelValue(host, model, values[i].Type, values[i].Data);
                }
            } else {
                result = this.GetModelValue(host, model, StringLiteralPartType.Encoded, statement.Name);
            }

            return result;
        }

        private GetModelValue(host: any[], model: any, type: StringLiteralPartType, data: string): string {
            var provider = new Infrastructure.ObjectModelValueProvider();
            var result = provider.GetValue(host, model, null, data);
            if (result.Result == true) {
                switch (type) {
                    case StringLiteralPartType.Encoded:
                        return encodeURI(result.Value);
                    case StringLiteralPartType.Raw:
                        return result.Value;
                }
            }

            return data;
        }

        public BeforeRender(statement: Statement, host: any[], model: any, rendererProvider: RendererProvider) { }

        public AfterRender(statement: Statement, host: any[], model: any, rendererProvider: RendererProvider) { }
    }
}