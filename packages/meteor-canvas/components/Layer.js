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
  }

  ready() {
    this.buffer = new Buffer2d(this.find('canvas'));
    this.autorun(() => {
      this.buffer.upscale(this.data('width'), this.data('height'));
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
        child.render(buffer);
      }

      buffer.restore();
// Request the next render
      MeteorCanvas.requestRender(() => this.render());
    }
  }
}