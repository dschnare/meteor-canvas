/*global Component*/
/*
 * A compnent that groups its children. This component can't have its width and
 * height set because its width and height are calculated to match the size of
 * all of its children.
 */
Component.Group = class extends CanvasComponent {
  static template() { return 'CanvasComponent'; }

  get dirty() {
    return this._dirty || this.children.some((c) => c.dirty);
  }
  set dirty(value) { this._dirty = !!value; }

  size() {
    let extent = new Rect();
    for (let child of this.children) {
      extent = extent.union(child.extent);
    }
    return { width: extent.width, height: extent.height };
  }

  measure() {
// Measure our children first.
    for (let child of this.children) {
      child.measure();
    }

    let {width, height} = this.size();
// Always set the width and height to match the size of our content.
    this.width = width + (this.padding * 2);
    this.height = height + (this.padding * 2);
  }
};