///<reference path="../parser.ts" />
///<reference path="../Infrastructure/ObjectModelValueProvider.ts" />
///<reference path="../Infrastructure/ValueTypeProvider.ts" />
module Parrot.Renderers {
    export class BaseRenderer {
        private getlocal() {
        }

        public GetLocalModelValue(host: any[], statement: Statement, model: any): any {
            var modelValueProvider = new Infrastructure.ObjectModelValueProvider();

            if (statement.Parameters.length > 0) {
                var result = modelValueProvider.GetValue(host, model, null, statement.Parameters[0].Value);
                if (result.Result == true) {
                    return result.Value;
                }
            }

            if (model != null) {
                var result = modelValueProvider.GetValue(host, model, ValueType.Property, null);
                if (result.Result == true) {
                    return result.Value;
                }
            }

            return model;
        }

        public BeforeRender(statement: Statement, host: any[], model: any, rendererProvider: RendererProvider) {
            if (statement.Parameters) {
                for (var i in statement.Parameters) {
                    var parameter = statement.Parameters[i];
                    if (parameter.Value && parameter.IsWrappedInQuotes()) {
                        var stringLiteral = new stringLiteral(parameter.Value);
                        var renderer = rendererProvider.getRenderer("string");
                        parameter.CalculatedValue = renderer.render(stringLiteral, host, model, rendererProvider);
                    }
                }
            }
        }

        public AfterRender(statement: Statement, host: any[], model: any, rendererProvider: RendererProvider) {
        }
    }
}