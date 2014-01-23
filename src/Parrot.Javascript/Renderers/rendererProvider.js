var Parrot;
(function (Parrot) {
    ///<reference path="htmlRenderer.ts" />
    ///<reference path="stringRenderer.ts" />
    ///<reference path="selfClosingRenderer.ts" />
    ///<reference path="docTypeRenderer.ts" />
    ///<reference path="listRenderer.ts" />
    (function (Renderers) {
        var RendererProvider = (function () {
            function RendererProvider() {
                this.renderers = [];
                this.renderers.push(new Parrot.Renderers.HtmlRenderer());
                this.renderers.push(new Parrot.Renderers.StringRenderer());
                this.renderers.push(new Parrot.Renderers.SelfClosingRenderer());
                this.renderers.push(new Parrot.Renderers.DocTypeRenderer());
                this.renderers.push(new Parrot.Renderers.ListRenderer());
            }
            RendererProvider.prototype.getRenderer = function (type) {
                for (var i in this.renderers) {
                    for (var g in this.renderers[i].Elements) {
                        if (type == this.renderers[i].Elements[g]) {
                            return this.renderers[i];
                        }
                    }
                }

                return this.getRenderer("*");
            };
            return RendererProvider;
        })();
        Renderers.RendererProvider = RendererProvider;
    })(Parrot.Renderers || (Parrot.Renderers = {}));
    var Renderers = Parrot.Renderers;
})(Parrot || (Parrot = {}));
//# sourceMappingURL=rendererProvider.js.map
