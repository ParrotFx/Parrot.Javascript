///<reference path="rendererProvider.ts" />
module Parrot.Renderers {
    export class ParrotDocumentView {
        public ParrotDocument: ParrotDocument;
        public RendererProvider: RendererProvider;

        constructor(parrotDocument: ParrotDocument) {
            this.ParrotDocument = parrotDocument;
            this.RendererProvider = new RendererProvider();
        }

        public Render(host: any[], model: any): string {
            var result: string = "";
            for (var i in this.ParrotDocument.Children) {
                var child = this.ParrotDocument.Children[i];

                var renderer = this.RendererProvider.getRenderer(child.Name);

                result += renderer.render(child, host, model, this.RendererProvider);
            }

            return result;
        }
    }
}