///<reference path="../parser.ts" />
///<reference path="./irenderer.ts" />
///<reference path="rendererProvider.ts" />
///<reference path="../Infrastructure/ObjectModelValueProvider.ts" />
///<reference path="../Infrastructure/ValueTypeProvider.ts" />
///<reference path="../Infrastructure/Locals.ts" />
///<reference path="../Infrastructure/exceptions.ts" />
///<reference path="./htmlRenderer.ts" />

module Parrot.Renderers {
    export class ListRenderer extends HtmlRenderer {
        EefaultChildTag: string = "li";
        RendererProvider: RendererProvider;
        Elements: string[] = ["ul", "ol"];

        public RenderChildren(statement: Statement, host: any[], model: any, defaultTag: string): string {
            if (defaultTag == null || defaultTag.length == 0) {
                defaultTag = this.DefaultChildTag;
            }

            if (statement.Parameters.length == 1) {
                //get the parameter value
                if (Object.prototype.toString.call(model) === '[object Array]') {
                    var result: string = "";
                    for (var i in model) {
                        var locals = new Infrastructure.Locals(host);
                        locals.push(this.IteratorItem(i, model));
                        result += super._renderChildren(statement.Children, host, model[i], defaultTag);
                        locals.pop();
                    }
                    return result;
                }
            }
            return this._renderChildren(statement.Children, host, model, defaultTag);
        }

        private IteratorItem(index: any, items: any[]): { _first: boolean; _last: boolean; _index: number; _even: boolean; _odd: boolean } {
            return {
                _first: index == 0,
                _last: index == items.length - 1,
                _index: index,
                _even: index % 2 == 0,
                _odd: index % 2 == 1
            }
        }
    }
}