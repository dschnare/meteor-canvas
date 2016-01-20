/*global Component*/
/*
 * A compnent that groups and clips its children. This component must have its
 * width and height set in order to clip its children. Otherwise width and
 * height are 0 and nothing will be rendered.
 */
Component.ClippingGroup = class extends CanvasComponent {
  static template() { return 'CanvasComponent'; }

  get dirty() {
    return super.dirty || this.children.some((c) => c.dirty);
  }

  renderChildren(buffer) {
    let extent = this.extent;
    extent.x = extent.y = 0;

    if (this.children.length) {
      let sorted = this.children.slice();
      sorted.sort(zSort);
      for (let child of sorted) {
        if (extent.intersects(child.extent)) {
          child.render(buffer);
        }
      }
    }
  }
};