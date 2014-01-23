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
        var InputRenderer = (function (_super) {
            __extends(InputRenderer, _super);
            function InputRenderer() {
                _super.apply(this, arguments);
                this.DefaultChildTag = "";
                this.Elements = ["input"];
            }
            InputRenderer.prototype.Render = function (statement, host, model, rendererProvider) {
                //get the local model
                //var localModel = this.getLocalModelValue(host, statement, model);
                var type = this.getType(statement, host, model);
                switch (type) {
                    case "checkbox":
                    case "radio":
                        for (var i = 0; i < statement.Attributes.length; i++) {
                            var attribute = statement.Attributes[i];
                            if (attribute.Key == "checked") {
                                var value = this.RenderAttribute(attribute, host, model);
                                switch (value) {
                                    case "true":
                                        statement.Attributes[i] = new Parrot.Attribute(attribute.Key, new Parrot.StringLiteral("\"checked\"", null, 0));
                                        break;
                                    case "false":
                                    case "null":
                                        statement.Attributes.splice(i, 1);
                                        i -= 1;
                                        break;
                                }
                            }
                        }
                        break;
                }

                return _super.prototype.Render.call(this, statement, host, model, rendererProvider);
            };

            InputRenderer.prototype.getType = function (statement, host, model) {
                for (var i = 0; i < statement.Attributes.length; i++) {
                    var attribute = statement.Attributes[i];
                    if (attribute.Key == "type") {
                        return this.RenderAttribute(attribute, host, model);
                    }
                }

                return "hidden";
            };
            return InputRenderer;
        })(Parrot.Renderers.SelfClosingRenderer);
        Renderers.InputRenderer = InputRenderer;
    })(Parrot.Renderers || (Parrot.Renderers = {}));
    var Renderers = Parrot.Renderers;
})(Parrot || (Parrot = {}));
//# sourceMappingURL=inputRenderer.js.map
