var Parrot;
(function (Parrot) {
    ///<reference path="../parser.ts" />
    ///<reference path="../Infrastructure/ObjectModelValueProvider.ts" />
    ///<reference path="../Infrastructure/ValueTypeProvider.ts" />
    (function (Renderers) {
        var BaseRenderer = (function () {
            function BaseRenderer() {
            }
            BaseRenderer.prototype.getlocal = function () {
            };

            BaseRenderer.prototype.GetLocalModelValue = function (host, statement, model) {
                var modelValueProvider = new Parrot.Infrastructure.ObjectModelValueProvider();

                if (statement.Parameters.length > 0) {
                    var result = modelValueProvider.GetValue(host, model, null, statement.Parameters[0].Value);
                    if (result.Result == true) {
                        return result.Value;
                    }
                }

                if (model != null) {
                    var result = modelValueProvider.GetValue(host, model, 1 /* Property */, null);
                    if (result.Result == true) {
                        return result.Value;
                    }
                }

                return model;
            };

            BaseRenderer.prototype.BeforeRender = function (statement, host, model, rendererProvider) {
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
            };

            BaseRenderer.prototype.AfterRender = function (statement, host, model, rendererProvider) {
            };
            return BaseRenderer;
        })();
        Renderers.BaseRenderer = BaseRenderer;
    })(Parrot.Renderers || (Parrot.Renderers = {}));
    var Renderers = Parrot.Renderers;
})(Parrot || (Parrot = {}));
//# sourceMappingURL=baseRenderer.js.map
