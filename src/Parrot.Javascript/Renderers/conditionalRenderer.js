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
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Parrot;
(function (Parrot) {
    (function (Renderers) {
        var ConditionalRenderer = (function (_super) {
            __extends(ConditionalRenderer, _super);
            function ConditionalRenderer() {
                _super.apply(this, arguments);
                this.Elements = ["conditional"];
            }
            ConditionalRenderer.prototype.Render = function (statement, host, model, rendererProvider) {
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
                    if (renderer instanceof Parrot.Renderers.StringRenderer) {
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
            };
            return ConditionalRenderer;
        })(Parrot.Renderers.HtmlRenderer);
        Renderers.ConditionalRenderer = ConditionalRenderer;
    })(Parrot.Renderers || (Parrot.Renderers = {}));
    var Renderers = Parrot.Renderers;
})(Parrot || (Parrot = {}));
//# sourceMappingURL=conditionalRenderer.js.map
