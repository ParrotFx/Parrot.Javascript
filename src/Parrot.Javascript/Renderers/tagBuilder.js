var Parrot;
(function (Parrot) {
    ///<reference path="../Infrastructure/exceptions.ts" />
    (function (Renderers) {
        (function (TagRenderMode) {
            TagRenderMode[TagRenderMode["StartTag"] = 0] = "StartTag";
            TagRenderMode[TagRenderMode["EndTag"] = 1] = "EndTag";
            TagRenderMode[TagRenderMode["SelfClosing"] = 2] = "SelfClosing";
            TagRenderMode[TagRenderMode["Normal"] = 3] = "Normal";
        })(Renderers.TagRenderMode || (Renderers.TagRenderMode = {}));
        var TagRenderMode = Renderers.TagRenderMode;

        var TagBuilder = (function () {
            function TagBuilder(name) {
                this.Name = name;
                this.InnerHtml = "";
                this.Attributes = [];
            }
            TagBuilder.prototype.toString = function (renderMode) {
                switch (renderMode) {
                    case 0 /* StartTag */:
                        return "<" + this.Name + this.AppendAttributes() + ">";
                    case 1 /* EndTag */:
                        return "</" + this.Name + ">";
                    case 2 /* SelfClosing */:
                        return "<" + this.Name + this.AppendAttributes() + " />";
                    default:
                        return "<" + this.Name + this.AppendAttributes() + this.InnerHtml + "</" + this.Name + ">";
                }
            };

            TagBuilder.prototype.AppendAttributes = function () {
                var render = "";
                for (var i in this.Attributes) {
                    var attribute = this.Attributes[i];
                    var key = i;
                    var value = attribute;

                    if (key == "id" && value == null || value.Length == 0) {
                        continue;
                    }

                    if (value != null) {
                        value = this.HtmlAttributeEncode(value);
                    } else {
                        value = key;
                    }

                    render += " " + key + "=\"" + value + "\"";
                }

                return render;
            };

            TagBuilder.prototype.HtmlAttributeEncode = function (value) {
                return value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;").replace("'", "&#39;");
            };

            TagBuilder.prototype.MergeAttribute = function (key, value, replaceExisting) {
                if (key == null || key.length == 0) {
                    throw new Parrot.Infrastructure.ArgumentException("key");
                }

                if (replaceExisting || !this.ContainsKey(this.Attributes, key)) {
                    this.Attributes[key] = value;
                }
            };

            TagBuilder.prototype.ContainsKey = function (source, key) {
                for (var i in source) {
                    if (i == key) {
                        return true;
                    }
                }

                return false;
            };

            TagBuilder.prototype.AddCssClass = function (value) {
                if (this.Attributes["class"] != undefined && this.Attributes["class"] != null) {
                    this.Attributes["class"] = value + " " + this.Attributes["class"];
                } else {
                    this.Attributes["class"] = value;
                }
            };
            return TagBuilder;
        })();
        Renderers.TagBuilder = TagBuilder;
    })(Parrot.Renderers || (Parrot.Renderers = {}));
    var Renderers = Parrot.Renderers;
})(Parrot || (Parrot = {}));
//# sourceMappingURL=tagBuilder.js.map
