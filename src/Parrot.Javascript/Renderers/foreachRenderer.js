///<reference path="../parser.ts" />
///<reference path="./irenderer.ts" />
///<reference path="rendererProvider.ts" />
///<reference path="../Infrastructure/ObjectModelValueProvider.ts" />
///<reference path="../Infrastructure/ValueTypeProvider.ts" />
///<reference path="../Infrastructure/Locals.ts" />
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
        var ForEachRenderer = (function (_super) {
            __extends(ForEachRenderer, _super);
            function ForEachRenderer() {
                _super.apply(this, arguments);
                this.defaultChildTag = "li";
                this.elements = ["foreach"];
            }
            ForEachRenderer.prototype.render = function (statement, host, model, rendererProvider) {
                //get the local model
                this.rendererProvider = rendererProvider;

                var localModel = this.GetLocalModelValue(host, statement, model);

                if (Object.prototype.toString.call(model) === '[object Array]') {
                    var result = "";
                    for (var i in model) {
                        var locals = new Parrot.Infrastructure.Locals(host);
                        locals.push(this.IteratorItem(i, model));
                        result += this._renderChildren(statement.Children, host, model[i], this.defaultChildTag);
                        locals.pop();
                    }
                    return result;
                }

                return "";
            };

            ForEachRenderer.prototype.IteratorItem = function (index, items) {
                return {
                    _first: index == 0,
                    _last: index == items.length - 1,
                    _index: index,
                    _even: index % 2 == 0,
                    _odd: index % 2 == 1
                };
            };
            return ForEachRenderer;
        })(Parrot.Renderers.HtmlRenderer);
        Renderers.ForEachRenderer = ForEachRenderer;
    })(Parrot.Renderers || (Parrot.Renderers = {}));
    var Renderers = Parrot.Renderers;
})(Parrot || (Parrot = {}));
//# sourceMappingURL=foreachRenderer.js.map
