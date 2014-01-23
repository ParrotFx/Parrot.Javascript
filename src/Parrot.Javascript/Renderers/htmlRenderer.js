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
        var HtmlRenderer = (function (_super) {
            __extends(HtmlRenderer, _super);
            function HtmlRenderer() {
                _super.apply(this, arguments);
                this.DefaultChildTag = "div";
                this.Elements = ["*"];
            }
            HtmlRenderer.prototype.Render = function (statement, host, model, rendererProvider) {
                //get the local model
                this.RendererProvider = rendererProvider;

                var localModel = this.GetLocalModelValue(host, statement, model);

                return this.CreateTag(statement, host, localModel);
            };

            HtmlRenderer.prototype.CreateTag = function (statement, host, model) {
                var tagName = statement.Name == null ? this.DefaultChildTag : statement.Name;

                var builder = new Parrot.Renderers.TagBuilder(tagName);

                this.RenderAttributes(host, model, statement, builder);

                var render = "";
                render += builder.toString(0 /* StartTag */);

                if (statement.Children.length > 0) {
                    render += this.RenderChildren(statement, host, model, this.DefaultChildTag);
                }

                render += builder.toString(1 /* EndTag */);

                return render;
            };

            HtmlRenderer.prototype.RenderAttribute = function (attribute, host, model) {
                var renderer = new Parrot.Renderers.StringRenderer();
                var result = "";

                result = renderer.Render(attribute.Value, host, model, this.RendererProvider);

                return result;
            };

            HtmlRenderer.prototype.RenderAttributes = function (host, model, statement, builder) {
                for (var i in statement.Attributes) {
                    var attribute = statement.Attributes[i];
                    if (attribute.Value == null) {
                        builder.MergeAttribute(attribute.Key, attribute.Key, true);
                    } else {
                        var attributeValue = this.RenderAttribute(attribute, host, model);
                        if (attribute.Key == "class") {
                            builder.AddCssClass(attributeValue);
                        } else {
                            builder.MergeAttribute(attribute.Key, attributeValue, true);
                        }
                    }
                }
            };

            HtmlRenderer.prototype.RenderChildren = function (statement, host, model, defaultTag) {
                if (defaultTag == null || defaultTag.length == 0) {
                    defaultTag = this.DefaultChildTag;
                }

                if (Object.prototype.toString.call(model) === '[object Array]') {
                    var result = "";
                    for (var i in model) {
                        result += this._renderChildren(statement.Children, host, model[i], defaultTag);
                    }
                    return result;
                }

                return this._renderChildren(statement.Children, host, model, defaultTag);
            };

            HtmlRenderer.prototype._renderChildren = function (children, host, model, defaultTag) {
                var result = "";
                for (var i in children) {
                    var child = children[i];

                    var renderer = this.RendererProvider.getRenderer(child.Name);
                    result += renderer.render(child, host, model, this.RendererProvider);
                }

                return result;
            };
            return HtmlRenderer;
        })(Parrot.Renderers.BaseRenderer);
        Renderers.HtmlRenderer = HtmlRenderer;
    })(Parrot.Renderers || (Parrot.Renderers = {}));
    var Renderers = Parrot.Renderers;
})(Parrot || (Parrot = {}));
//# sourceMappingURL=htmlRenderer.js.map
