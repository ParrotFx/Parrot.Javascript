///<reference path="../parser.ts" />
///<reference path="./irenderer.ts" />
///<reference path="./rendererProvider.ts" />
///<reference path="../Infrastructure/ObjectModelValueProvider.ts" />
///<reference path="../Infrastructure/ValueTypeProvider.ts" />
///<reference path="../Infrastructure/exceptions.ts" />
///<reference path="./tagBuilder.ts" />
///<reference path="./baseRenderer.ts" />
///<reference path="./selfClosingRenderer.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Parrot;
(function (Parrot) {
    (function (Renderers) {
        var IfRenderer = (function (_super) {
            __extends(IfRenderer, _super);
            function IfRenderer() {
                _super.apply(this, arguments);
                this.DefaultChildTag = "";
                this.Elements = ["if"];
            }
            IfRenderer.prototype.Render = function (statement, host, model, rendererProvider) {
                this.RendererProvider = rendererProvider;

                //get the local model
                //var localModel = this.getLocalModelValue(host, statement, model);
                var localModel = this.GetLocalModelValue(host, statement, model);

                if (localModel != null && localModel == true) {
                    return this.RenderChildren(statement, host, model, this.DefaultChildTag);
                }
            };
            return IfRenderer;
        })(Parrot.Renderers.HtmlRenderer);
        Renderers.IfRenderer = IfRenderer;
    })(Parrot.Renderers || (Parrot.Renderers = {}));
    var Renderers = Parrot.Renderers;
})(Parrot || (Parrot = {}));
//# sourceMappingURL=ifRenderer.js.map
