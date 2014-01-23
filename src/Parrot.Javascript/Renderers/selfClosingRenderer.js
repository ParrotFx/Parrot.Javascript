///<reference path="../parser.ts" />
///<reference path="./irenderer.ts" />
///<reference path="rendererProvider.ts" />
///<reference path="../Infrastructure/ObjectModelValueProvider.ts" />
///<reference path="../Infrastructure/ValueTypeProvider.ts" />
///<reference path="../Infrastructure/exceptions.ts" />
///<reference path="./htmlRenderer.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Parrot;
(function (Parrot) {
    (function (Renderers) {
        var SelfClosingRenderer = (function (_super) {
            __extends(SelfClosingRenderer, _super);
            function SelfClosingRenderer() {
                _super.apply(this, arguments);
                this.DefaultChildTag = "";
                this.Elements = ["base", "basefont", "frame", "link", "meta", "area", "br", "col", "hr", "img", "param"];
            }
            SelfClosingRenderer.prototype.Render = function (statement, host, model, rendererProvider) {
                //get the local model
                var localModel = this.GetLocalModelValue(host, statement, model);

                return this.CreateTag(statement, host, localModel);
            };

            SelfClosingRenderer.prototype.createTag = function (statement, host, model) {
                var tagName = statement.Name == null || statement.Name.length == 0 ? this.DefaultChildTag : statement.Name;
                var builder = new Parrot.Renderers.TagBuilder(tagName);
                this.RenderAttributes(host, model, statement, builder);

                return builder.toString(2 /* SelfClosing */);
            };
            return SelfClosingRenderer;
        })(Parrot.Renderers.HtmlRenderer);
        Renderers.SelfClosingRenderer = SelfClosingRenderer;
    })(Parrot.Renderers || (Parrot.Renderers = {}));
    var Renderers = Parrot.Renderers;
})(Parrot || (Parrot = {}));
//# sourceMappingURL=selfClosingRenderer.js.map
