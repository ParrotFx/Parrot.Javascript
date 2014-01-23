///<reference path="../parser.ts" />
///<reference path="./irenderer.ts" />
///<reference path="rendererProvider.ts" />
///<reference path="../Infrastructure/ObjectModelValueProvider.ts" />
///<reference path="../Infrastructure/ValueTypeProvider.ts" />
///<reference path="../Infrastructure/exceptions.ts" />
var Parrot;
(function (Parrot) {
    (function (Renderers) {
        var StringRenderer = (function () {
            function StringRenderer() {
                this.DefaultChildTag = "";
                this.Elements = ["string"];
            }
            StringRenderer.prototype.Render = function (statement, host, model, rendererProvider) {
                //get the local model
                this.RendererProvider = rendererProvider;
                var result = "";
                if (statement instanceof Parrot.StringLiteral) {
                    var values = statement.Values;
                    for (var i in values) {
                        result += this.GetModelValue(host, model, values[i].Type, values[i].Data);
                    }
                } else {
                    result = this.GetModelValue(host, model, 1 /* Encoded */, statement.Name);
                }

                return result;
            };

            StringRenderer.prototype.GetModelValue = function (host, model, type, data) {
                var provider = new Parrot.Infrastructure.ObjectModelValueProvider();
                var result = provider.GetValue(host, model, null, data);
                if (result.Result == true) {
                    switch (type) {
                        case 1 /* Encoded */:
                            return encodeURI(result.Value);
                        case 2 /* Raw */:
                            return result.Value;
                    }
                }

                return data;
            };

            StringRenderer.prototype.BeforeRender = function (statement, host, model, rendererProvider) {
            };

            StringRenderer.prototype.AfterRender = function (statement, host, model, rendererProvider) {
            };
            return StringRenderer;
        })();
        Renderers.StringRenderer = StringRenderer;
    })(Parrot.Renderers || (Parrot.Renderers = {}));
    var Renderers = Parrot.Renderers;
})(Parrot || (Parrot = {}));
//# sourceMappingURL=stringRenderer.js.map
