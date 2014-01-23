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
        var ListRenderer = (function (_super) {
            __extends(ListRenderer, _super);
            function ListRenderer() {
                _super.apply(this, arguments);
                this.EefaultChildTag = "li";
                this.Elements = ["ul", "ol"];
            }
            ListRenderer.prototype.RenderChildren = function (statement, host, model, defaultTag) {
                if (defaultTag == null || defaultTag.length == 0) {
                    defaultTag = this.DefaultChildTag;
                }

                if (statement.Parameters.length == 1) {
                    //get the parameter value
                    if (Object.prototype.toString.call(model) === '[object Array]') {
                        var result = "";
                        for (var i in model) {
                            var locals = new Parrot.Infrastructure.Locals(host);
                            locals.push(this.IteratorItem(i, model));
                            result += _super.prototype._renderChildren.call(this, statement.Children, host, model[i], defaultTag);
                            locals.pop();
                        }
                        return result;
                    }
                }
                return this._renderChildren(statement.Children, host, model, defaultTag);
            };

            ListRenderer.prototype.IteratorItem = function (index, items) {
                return {
                    _first: index == 0,
                    _last: index == items.length - 1,
                    _index: index,
                    _even: index % 2 == 0,
                    _odd: index % 2 == 1
                };
            };
            return ListRenderer;
        })(Parrot.Renderers.HtmlRenderer);
        Renderers.ListRenderer = ListRenderer;
    })(Parrot.Renderers || (Parrot.Renderers = {}));
    var Renderers = Parrot.Renderers;
})(Parrot || (Parrot = {}));
//# sourceMappingURL=listRenderer.js.map
