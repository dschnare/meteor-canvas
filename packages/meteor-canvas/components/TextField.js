/*global Component*/
Component.TextField = class extends CanvasComponent {
// All Meteor Canvas components that render to a canvas should use the
// CanvasComponent template.
  static template() { return 'CanvasComponent'; }

  get text() { return this._text; }
  set text(value) {
    if (value !== this._text) {
      this._text = value;
      this.dirty = true;
    }
  }

  get fontFamily() { return this._fontFamily; }
  set fontFamily(value) {
    if (value !== this._fontFamily) {
      this._fontFamily = value;
      this.dirty = true;
    }
  }

  get fontSize() { return this._fontSize; }
  set fontSize(value) {
    if (value !== this._fontSize) {
      this._fontSize = value;
      this.dirty = true;
    }
  }

  get lineHeight() { return this._lineHeight; }
  set lineHeight(value) {
    if (value !== this._lineHeight) {
      this._lineHeight = value;
      this.dirty = true;
    }
  }

  get fillStyle() { return this._fillStyle; }
  set fillStyle(value) {
    if (value !== this._fillStyle) {
      this._fillStyle = value;
      this.dirty = true;
    }
  }

  initialize() {
    super.initialize();
// Set each of our properties.
    this.autorun(() => this.text = this.data('text') || '');
    this.autorun(() => this.fontFamily = this.data('fontFamily') || 'Arial');
    this.autorun(() => this.fontSize = this.data('fontSize') || '12px');
    this.autorun(() => this.lineHeight = this.data('lineHeight') || '12px');
    this.autorun(() => this.fillStyle = this.data('fillStyle') || 'black');
  }

  size() {
    return measureText(
      this.text,
      this.fontFamily,
      this.fontSize,
      this.lineHeight
    );
  }

  updateBackBuffer(backBuffer) {
    let {x, y, height} = this.contentExtent;

    backBuffer.save();
    backBuffer.ctx.font =
      `${this.fontSize}/${this.lineHeight} ${this.fontFamily}`;
    backBuffer.ctx.textBaseline = 'middle';
    backBuffer.ctx.fillStyle = this.fillStyle;

    backBuffer.ctx.fillText(this.text, x, (0.5 + ((height/2) + y)) | 0);
    backBuffer.restore();
  }

  destroy() {
    this.buffer.destroy();
  }
}