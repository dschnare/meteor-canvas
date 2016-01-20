/*global Rect*/
let min = Math.min;
let max = Math.max;
let abs = Math.abs;
// A general purpose rectangle geometry.
Rect = class {
  get left() { return this.x; }
  set left(value) { this.x = value; }

  get right() { return abs(this.x) + this.width; }
  set right(value) { this.width = value - abs(this.x); }

  get top() { return this.y; }
  set top(value) { this.y = value; }

  get bottom() { return abs(this.y) + this.height; }
  set bottom(value) { this.height = value - abs(this.y); }

  constructor(x=0, y=0, width=0, height=0) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  // containsPoint({x, y})
  // containsPoint(x, y)
  containsPoint(x, y) {
    if (typeof x === 'object' && x) {
      y = x.y;
      x = x.x;
    }
    return this.x <= x && this.y <= y && this.right >= x && this.bottom >= y;
  }

  // Offset the x and y properties and return a new rect with the result.
  offset(x, y=NaN) {
    return new Rect(
      this.x + x,
      this.y + (isNaN(y) ? x : y),
      this.width,
      this.height
    );
  }

  // Pad the width and height and return a new rect with the result.
  pad(padding) {
    return new Rect(
      this.x,
      this.y,
      this.width += padding * 2,
      this.height += padding * 2
    );
  }

  // Union a rect with this rect and return a new rect with the result.
  union(rect) {
    let ex = new Rect();

    ex.x = min(this.x, rect.x);
    ex.y = min(this.y, rect.y);
    ex.right = max(this.right, rect.right);
    ex.bottom = max(this.bottom, rect.bottom);

    return ex;
  }

  intersects(rect) {
    return !(this.right < rect.left ||
      this.left > rect.right||
      this.top > rect.bottom ||
      this.bottom < rect.top);
  }

  // Create a copy of this rect.
  copy() {
    return new Rect(this.x, this.y, this.width, this.height);
  }
};