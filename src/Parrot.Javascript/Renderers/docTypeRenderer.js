///<reference path="../parser.ts" />
///<reference path="./irenderer.ts" />
///<reference path="./rendererProvider.ts" />
///<reference path="../Infrastructure/ObjectModelValueProvider.ts" />
///<reference path="../Infrastructure/ValueTypeProvider.ts" />
///<reference path="../Infrastructure/exceptions.ts" />
///<reference path="./tagBuilder.ts" />
///<reference path="./baseRenderer.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Parrot;
(function (Parrot) {
    (function (Renderers) {
        var DocTypeRenderer = (function (_super) {
            __extends(DocTypeRenderer, _super);
            function DocTypeRenderer() {
                _super.apply(this, arguments);
                this.DefaultChildTag = "div";
                this.Elements = ["doctype"];
            }
            DocTypeRenderer.prototype.Render = function (statement, host, model, rendererProvider) {
                var value = "html";

                if (statement.Parameters.length > 0) {
                    var localModel = this.GetLocalModelValue(host, statement, model);
                    value = localModel;
                }

                return "<!DOCTYPE " + value + ">";
            };

            DocTypeRenderer.prototype.AfterRender = function (statement, host, model, rendererProvider) {
            };
            return DocTypeRenderer;
        })(Parrot.Renderers.BaseRenderer);
        Renderers.DocTypeRenderer = DocTypeRenderer;
    })(Parrot.Renderers || (Parrot.Renderers = {}));
    var Renderers = Parrot.Renderers;
})(Parrot || (Parrot = {}));
//# sourceMappingURL=docTypeRenderer.js.map
