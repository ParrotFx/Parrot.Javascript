///<reference path="../parser.ts" />
///<reference path="./irenderer.ts" />
///<reference path="./rendererProvider.ts" />
///<reference path="../Infrastructure/ObjectModelValueProvider.ts" />
///<reference path="../Infrastructure/ValueTypeProvider.ts" />
///<reference path="../Infrastructure/exceptions.ts" />
///<reference path="./tagBuilder.ts" />
///<reference path="./baseRenderer.ts" />

module Parrot.Renderers {
    export class HtmlRenderer extends BaseRenderer implements IRenderer {
        public DefaultChildTag: string = "div";
        public RendererProvider: RendererProvider;
        public Elements: string[] = ["*"];

        public Render(statement: Statement, host: any[], model: any, rendererProvider: RendererProvider): string {
            //get the local model
            this.RendererProvider = rendererProvider;

            var localModel = this.GetLocalModelValue(host, statement, model);

            return this.CreateTag(statement, host, localModel);
        }

        public CreateTag(statement: Statement, host: any[], model: any): string {
            var tagName: string = statement.Name == null ? this.DefaultChildTag : statement.Name;

            var builder = new TagBuilder(tagName);

            this.RenderAttributes(host, model, statement, builder);

            var render = "";
            render += builder.toString(TagRenderMode.StartTag);

            if (statement.Children.length > 0) {
                render += this.RenderChildren(statement, host, model, this.DefaultChildTag);
            }

            render += builder.toString(TagRenderMode.EndTag);

            return render;
        }

        public RenderAttribute(attribute: Attribute, host: any[], model: any): string {
            var renderer = new StringRenderer();
            var result: string = "";

            result = renderer.Render(attribute.Value, host, model, this.RendererProvider);

            return result;
        }

        public RenderAttributes(host: any[], model: any, statement: Statement, builder: TagBuilder): void {
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
        }

        public RenderChildren(statement: Statement, host: any[], model: any, defaultTag: string): string {
            if (defaultTag == null || defaultTag.length == 0) {
                defaultTag = this.DefaultChildTag;
            }

            if (Object.prototype.toString.call(model) === '[object Array]') {
                var result: string = "";
                for (var i in model) {
                    result += this._renderChildren(statement.Children, host, model[i], defaultTag);
                }
                return result;
            }

            return this._renderChildren(statement.Children, host, model, defaultTag);
        }

        public _renderChildren(children: Statement[], host: any[], model: any, defaultTag: string): string {
            var result: string = "";
            for (var i in children) {
                var child = children[i];

                var renderer = this.RendererProvider.getRenderer(child.Name);
                result += renderer.render(child, host, model, this.RendererProvider);
            }

            return result;
        }
    }
}