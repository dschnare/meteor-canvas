// Component that is responsible for managing a canvas element in the view.
//
// Accepts the following data parameters:
// id (optional) - The value to set the id attribute to
// className (optional) - The value to set the class attribute to
// width - The width of the canvas
// height - The height of the canvas
Component.Layer = class {
  constructor() {
    this.destroyed = false;
    this.viewport = new Rect();
// The root of a view hiearchy will have the parent point to itself.
    this.parent = this;
  }

  ready() {
    this.buffer = new Buffer2d(this.find('canvas'));
    this.autorun(() => {
      this.viewport.width = this.data('width');
      this.viewport.height = this.data('height');
      this.buffer.upscale(this.viewport.width, this.viewport.height);
    });
// Request the first render
    MeteorCanvas.requestRender(() => this.render());
  }

  destroy() {
    this.destroyed = true;
    this.buffer.destroy();
  }

  render() {
    if (!this.destroyed) {
// Render our children
      let buffer = this.buffer;
      buffer.save();

      let sortedChildren = this.children.slice();
      sortedChildren.sort(zSort);

      for (let child of sortedChildren) {
        child.measure();
// Only render children that are within the bounds of the canvas
        if (this.viewport.intersects(child.extent)) {
          child.render(buffer);
        }
      }

      buffer.restore();
// Request the next render
      MeteorCanvas.requestRender(() => this.render());
    }
  }
}

Component.Layer.prototype.localToGlobal = CanvasComponent.prototype.localToGlobal;
Component.Layer.prototype.globalToLocal = CanvasComponent.prototype.globalToLocal;