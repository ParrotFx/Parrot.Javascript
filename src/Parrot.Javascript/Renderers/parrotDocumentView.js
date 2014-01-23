var Parrot;
(function (Parrot) {
    ///<reference path="rendererProvider.ts" />
    (function (Renderers) {
        var ParrotDocumentView = (function () {
            function ParrotDocumentView(parrotDocument) {
                this.ParrotDocument = parrotDocument;
                this.RendererProvider = new Parrot.Renderers.RendererProvider();
            }
            ParrotDocumentView.prototype.Render = function (host, model) {
                var result = "";
                for (var i in this.ParrotDocument.Children) {
                    var child = this.ParrotDocument.Children[i];

                    var renderer = this.RendererProvider.getRenderer(child.Name);

                    result += renderer.render(child, host, model, this.RendererProvider);
                }

                return result;
            };
            return ParrotDocumentView;
        })();
        Renderers.ParrotDocumentView = ParrotDocumentView;
    })(Parrot.Renderers || (Parrot.Renderers = {}));
    var Renderers = Parrot.Renderers;
})(Parrot || (Parrot = {}));
//# sourceMappingURL=parrotDocumentView.js.map
