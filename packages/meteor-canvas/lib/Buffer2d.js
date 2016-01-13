/*global Buffer2d*/
// A convenient wrapper for dealing with a canvas' 2D context.
// All operations perform pixel rounding to attempt to increase performance.
// See: http://www.html5rocks.com/en/tutorials/canvas/performance/
Buffer2d = class {
  constructor(canvas=null) {
    this.canvas = canvas || document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  // Attempts to upscale the buffer's canvas to match the pixel ratio of the
  // device. You'll likely only want to call this one and not on low-end
  // devices.
  // See: http://bit.ly/1Q0oZhX
  upscale(width, height) {
    let ratio = getDevicePixelRatio();

    width = width || this.canvas.width;
    height = height || this.canvas.height;

    if (ratio !== 1) {
      this.canvas.width = (0.5 + (width * ratio)) | 0;
      this.canvas.height = (0.5 + (height * ratio)) | 0;
      this.canvas.style.width = ((0.5 + width) | 0) + 'px';
      this.canvas.style.height = ((0.5 + height) | 0) + 'px';
      this.ctx.scale(ratio, ratio);
    } else {
      this.canvas.width = (0.5 + (width * ratio)) | 0;
      this.canvas.height = (0.5 + (height * ratio)) | 0;
    }
  }

  // Draws a drawable object to the buffer's canvas. Where drawable can be an
  // instance of any of the following.
  // - Buffer2d
  // - Image
  // - Canvas
  // - Video
  //
  // draw(drawable)
  // draw(drawable, dx, dy)
  // draw(drawable, dx, dy, dw, dh)
  // draw(drawable, sx, sy, sw, sh, dx, dy, dw, dh)
  draw(drawable, ...args) {
    drawable = drawable.canvas || drawable;

    if (arguments.length <= 2) {
      let [dx, dy] = args;
      dx = (0.5 + (dx || 0)) | 0;
      dy = (0.5 + (dy || 0)) | 0;
      this.ctx.drawImage(drawable, dx, dy);
    } else if (arguments.length <= 4) {
      let [dx, dy, dw, dh] = args;
      dx = (0.5 + (dx || 0)) | 0;
      dy = (0.5 + (dy || 0)) | 0;
      dw = (0.5 + (dw || drawable.width)) | 0;
      dh = (0.5 + (dh || drawable.height)) | 0;
      this.ctx.drawImage(drawable, dx, dy, dw, dh);
    } else {
      let [dx, dy, dw, dh, sx, sy, sw, sh] = args;
      sx = (0.5 + (sx || 0)) | 0;
      sy = (0.5 + (sy || 0)) | 0;
      sw = (0.5 + (sw || drawable.width)) | 0;
      sh = (0.5 + (sh || drawable.height)) | 0;

      dx = (0.5 + (dx || 0)) | 0;
      dy = (0.5 + (dy || 0)) | 0;
      dw = (0.5 + (dw || drawable.width)) | 0;
      dh = (0.5 + (dh || drawable.height)) | 0;
      this.ctx.drawImage(drawable, sx, sy, sw, sh, dx, dy, dw, dh);
    }
  }

  translate(x, y) {
    if (typeof x === 'object' && x) {
      y = x.y;
      x = x.x;
    }
    this.ctx.translate((0.5 + x) + 0, (0.5 + y) + 0);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  save() {
    this.ctx.save();
  }

  restore() {
    this.ctx.restore();
  }

  // Resize this buffer's canvas.
  //
  // resize({width, height})
  // resize(width, height)
  resize(width, height) {
    if (typeof width === 'object' && width) {
      height = width.height;
      width = width.width;
    }
    this.canvas.width = (0.5 + width) | 0;
    this.canvas.height = (0.5 + height) | 0;
  }

  // Null out this buffer's canvas and 2D context.
  destroy() {
    this.canvas = null;
    this.ctx = null;
  }
}