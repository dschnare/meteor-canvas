/*global BorderMixin*/
// Mixin that can render a rectangular border around a component.
// This mixin adds the following properties to the component directly.
// - borderThickness (default 0)
// - borderStyle (default 'black')
//
// The border thickness defaults to 0 so no border will be rendered.
let floor = Math.floor;
BorderMixin = class {
  get z() { return this._z; }
  set z(value) {
    if (value !== this._z) {
      this._z = value;
      if (this.owner) this.owner.dirty = true;
    }
  }

  get thickness() { return this._thickness; }
  set thickness(value) {
    if (value !== this._thickness) {
      this._thickness = value;
      if (this.owner) this.owner.dirty = true;
    }
  }

  get strokeStyle() { return this._strokeStyle; }
  set strokeStyle(value) {
    if (value !== this._strokeStyle) {
      this._strokeStyle = value;
      if (this.owner) this.owner.dirty = true;
    }
  }

  constructor(thickness=0, strokeStyle='black', z=1000) {
    this.thickness = thickness || 0;
    this.strokeStyle = strokeStyle || 'black';
    this.z = z || 1000;
  }

  initialize() {
    let self = this;
    Object.defineProperties(this.owner, {
      borderThickness: {
        get() { return self.thickness; },
        set(value) { self.thickness = value; }
      },
      borderStyle: {
        get() { return self.strokeStyle; },
        set(value) { self.strokeStyle = value; }
      }
    });

    this.owner.autorun(
      () => this.thickness = this.owner.data('borderThickness') || 0);
    this.owner.autorun(
      () => this.strokeStyle = this.owner.data('borderStyle') || 0);
  }

  render(buffer) {
    if (this.thickness > 0) {
      let {width, height} = this.owner;
      let offset = this.thickness / 2;

      buffer.save();
      buffer.ctx.lineWidth = this.thickness;
      buffer.ctx.strokeStyle = this.strokeStyle;
// NOTE (Darren): When drawing lines we have to straddle the pixels in order for
// our lines not to be blurry.
// See: http://diveintohtml5.info/canvas.html
//
// Weird that blurriness doesn't seem to be a problem anymore even without
// pixel straddling. However, stroking a rect takes some hackery to get it
// to only be drawn at a particular size (we have to offset it in all
// directions).
      buffer.ctx.strokeRect(
        offset,
        offset,
        width - this.thickness,
        height - this.thickness
      );
      buffer.restore();
    }
  }
};