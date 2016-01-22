/*global CanvasComponent*/
/*
 * The base class for all Meteor Canvas components or custom components that
 * want to render themselves to a canvas.
 */
CanvasComponent = class {
  get x() { return this._x; }
  set x(value) {
    if (value !== this._x) {
      this._x = value;
      if (this.parent) this.parent.dirty = true;
    }
  }

  get y() { return this._y; }
  set y(value) {
    if (value !== this._y) {
      this._y = value;
      if (this.parent) this.parent.dirty = true;
    }
  }

  get z() { return this._z; }
  set z(value) {
    if (value !== this._z) {
      this._z = value;
      if (this.parent) this.parent.dirty = true;
    }
  }

  get width() { return this._width; }
  set width(value) {
    if (value !== this._width) {
      this._width = value;
      this._widthSet = true;
      this.dirty = true;
    }
  }

  get height() { return this._height; }
  set height(value) {
    if (value !== this._height) {
      this._height = value;
      this._heightSet = true;
      this.dirty = true;
    }
  }

  get alpha() { return this._alpha; }
  set alpha(value) {
    if (value !== this._alpha) {
      this._alpha = value;
      if (this.parent) this.parent.dirty = true;
    }
  }

  get padding() { return this._padding; }
  set padding(value) {
    if (value !== this._padding) {
      this._padding = value;
      this.dirty = true;
    }
  }

  get backgroundStyle() { return this._backgroundStyle; }
  set backgroundStyle(value) {
    if (value !== this._backgroundStyle) {
      this._backgroundStyle = value;
      this.dirty = true;
    }
  }

  get dirty() { return this._dirty; }
  set dirty(value) { this._dirty = !!value; }

  get extent() {
    return new Rect(this.x, this.y, this.width, this.height);
  }

  get contentExtent() {
    let padding = this.padding;
    let {width, height} = this.size();

    if (this.width) {
      width = this.width - padding * 2;
    }

    if (this.height) {
      height = this.height - padding * 2;
    }

    return new Rect(padding, padding, width, height);
  }

  /*
   * Covnenience method used to set mulitple properties all at once.
   */
  props(map) {
    for (let key in map) {
      if (key in this) {
        this[key] = map[key];
      }
    }
  }

  // localToGlobal({x, y})
  // localToGlobal(x, y)
  localToGlobal(x, y) {
    if (x && typeof x === 'object') {
      y = x.y;
      x = x.x;
    }
    // NOTE: We only permit translation operations
    // so we just need to concern ourselves with x and y.
    // If we were to permit scaling and rotating components
    // then we would need each component maintain a local
    // matrix transform and we would have to compose matrices
    // up the entire hierarchy.
    if (this.parent) {
      return this.parent.localToGlobal({
        x: this.x + x,
        y: this.y + y
      });
    } else {
      return { x: x, y: y };
    }
  }

  initialize() {
    this.dirty = true;
    this._extent = new Rect();
    this.buffer = new Buffer2d();

// Set width and height to start out as 0 so that when they are first set in
// the autorun() below they won't inadvertantly set _widthSet and _heightSet
// when the data context doesn't have the width and height keys. This is so
// that the component can set the width and height during the measure phase
// when the width and height have not been set using the publich API.
    this._width = 0;
    this._height = 0;

    this.autorun(() => this.x = this.data('x') || 0);
    this.autorun(() => this.y = this.data('y') || 0);
    this.autorun(() => this.z = this.data('z') || 0);
    this.autorun(() => this.padding = this.data('padding') || 0);
    this.autorun(() => this.width = this.data('width') || 0);
    this.autorun(() => this.height = this.data('height') || 0);
    this.autorun(() => this.alpha = this.data('alpha') || 1);
    this.autorun(
      () => this.backgroundStyle = this.data('backgroundStyle') || ''
    );
  }

  mixins() {
    return [
      new BorderMixin()
    ];
  }

  // Perform the measure phase before we render. This will get the size of the
  // content to render and set the width and height properties if they have not
  // been set so they reflect acurate values.
  measure() {
    for (let child of this.children) {
      child.measure();
    }

    let {width, height} = this.size();
// Set the width and height if they are not set
    if (!this._widthSet) this._width = width + (this.padding * 2);
    if (!this._heightSet) this._height = height + (this.padding * 2);
  }

  render(buffer) {
// Update the back buffer if we're dirty
    if (this.dirty) {
// Measure ourselves and if our width and height are not set then we set them
      this.buffer.upscale(this.width, this.height);
// Draw the background if we have one
      if (this.backgroundStyle) {
        this.buffer.save();
        this.buffer.ctx.fillStyle = this.backgroundStyle;
        this.buffer.ctx.fillRect(0, 0, this.width, this.height);
        this.buffer.restore();
      }
// Update the back buffer
      this.updateBackBuffer(this.buffer);
// Render our children to the back buffer
      this.renderChildren(this.buffer);
// Render our mixins to the back buffer
      this.renderMixins(this.buffer);
// Reset our dirty flag
      this.dirty = false;
    }

// Save the context and set our position and alpha and blit the back buffer to
// the screen. Alpha affects how the back buffer is composited so we have to
// set the globalAlpha here.
    buffer.save();
    if (this.alpha !== 1) buffer.ctx.globalAlpha = this.alpha;
    buffer.draw(this.buffer, this.x, this.y, this.width, this.height);
    buffer.restore();
  }

  renderChildren(buffer) {
    if (this.children.length) {
      let sorted = this.children.slice();
      sorted.sort(zSort);
      for (let child of sorted) {
        child.render(buffer);
      }
    }
  }

  renderMixins(buffer) {
    let instances = this._mixinInstances;
    if (instances && instances.length) {
      let sorted = instances.filter((m) => typeof m.render === 'function');
      sorted.sort(zSort);
      for (let mixin of sorted) {
        mixin.render(buffer);
      }
    }
  }

  updateBackBuffer(backBuffer) {
// Subclasses can override this if they are drawing to the back buffer.
  }

  /*
   * Retrieve the size of the region this component would like to render its
   * content to. By default it returns the width and height specified on the
   * component. Override this if the component is performing a custom render
   * to the back buffer that requires a specific size of buffer.
   */
  size() {
// Subclasses can override this if they are drawing to the canvas. Generally
// subclasses provide their own measurement or return the value of calling
// the super.measure() version. This is the content size, the size of the
// region the component would like to render to.
    return { width: this.width, height: this.height };
  }
}