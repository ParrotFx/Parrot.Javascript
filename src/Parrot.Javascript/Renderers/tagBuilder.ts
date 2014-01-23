///<reference path="../Infrastructure/exceptions.ts" />
module Parrot.Renderers {
    export enum TagRenderMode {
        StartTag,
        EndTag,
        SelfClosing,
        Normal
    }

    export class TagBuilder {
        public Name: string;
        public InnerHtml: string;
        public Attributes: any[];

        constructor(name: string) {
            this.Name = name;
            this.InnerHtml = "";
            this.Attributes = [];
        }

        public toString(renderMode: TagRenderMode): string {
            switch (renderMode) {
                case TagRenderMode.StartTag:
                    return "<" + this.Name + this.AppendAttributes() + ">";
                case TagRenderMode.EndTag:
                    return "</" + this.Name + ">";
                case TagRenderMode.SelfClosing:
                    return "<" + this.Name + this.AppendAttributes() + " />";
                default:
                    return "<" + this.Name + this.AppendAttributes() + this.InnerHtml + "</" + this.Name + ">";
            }
        }

        private AppendAttributes(): string {
            var render: string = "";
            for (var i in this.Attributes) {
                var attribute = this.Attributes[i];
                var key: string = i;
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
        }

        private HtmlAttributeEncode(value: string): string {
            return value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;").replace("'", "&#39;");
        }

        public MergeAttribute(key: string, value: string, replaceExisting: boolean) {
            if (key == null || key.length == 0) {
                throw new Infrastructure.ArgumentException("key");
            }

            if (replaceExisting || !this.ContainsKey(this.Attributes, key)) {
                this.Attributes[key] = value;
            }
        }

        private ContainsKey(source: any[], key: string) {
            for (var i in source) {
                if (i == key) {
                    return true;
                }
            }

            return false;
        }

        public AddCssClass(value: string): void {
            if (this.Attributes["class"] != undefined && this.Attributes["class"] != null) {
                this.Attributes["class"] = value + " " + this.Attributes["class"];
            } else {
                this.Attributes["class"] = value;
            }
        }
    }
}