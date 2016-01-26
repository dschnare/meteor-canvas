/*global Component, CanvasComponent*/
Component.HorizontalStack = class extends CanvasComponent {
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
    this.width = width + (this.padding * 2);
    if (!this.height) this.height = height + (this.padding * 2);
  }

  layout() {
    let left = 0;
    let layoutSize = { width: 0, height: 0 };
    let max = Math.max;
    let {height, _heightSet:heightSet} = this.height;
    let spacing = this.spacing;

    for (let child of this.children) {
      child.x = left;
      child.y = 0;
      if (heightSet) child.height = height;

      left += child.width + spacing;

      layoutSize.width += child.width + spacing;
      layoutSize.height = max(layoutSize.height, child.height);
    }

// Remove the last spacing added.
    if (layoutSize.width) layoutSize.width -= spacing;

    return layoutSize;
  }
};