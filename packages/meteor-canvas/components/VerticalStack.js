/*global Component, CanvasComponent*/
Component.VerticalStack = class extends CanvasComponent {
  static template() { return 'CanvasComponent'; }

  get dirty() {
    return this._dirty || this.children.some((c) => c.dirty);
  }
  set dirty(value) { this._dirty = !!value; }

  get spacing() { return this._spacing; }
  set spacing(value) {
    if (value !== this._spacing) {
      this._spacing = value;
      this.dirty = true;
    }
  }

  initialize() {
    super.initialize();
    this.autorun(() => this.spacing = this.data('spacing') || 0);
  }

  size() {
    return this.layout();
  }

  measure() {
    for (let child of this.children) {
      child.measure();
    }

    let {width, height} = this.size();
    if (!this.width) this.width = width + (this.padding * 2);
    this.height = height + (this.padding * 2);
  }

  layout() {
    let top = 0;
    let layoutSize = { width: 0, height: 0 };
    let max = Math.max;
    let {width, _widthSet:widthSet} = this.width;
    let spacing = this.spacing;

    for (let child of this.children) {
      child.x = 0;
      child.y = top;
      if (widthSet) child.width = width

      top += child.height + spacing;

      layoutSize.width = max(layoutSize.width, child.width);
      layoutSize.height += child.height + spacing;
    }

// Remove the last spacing.
    if (layoutSize.height) layoutSize.height -= spacing;

    return layoutSize;
  }
};