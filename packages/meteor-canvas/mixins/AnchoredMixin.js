/*global ComponentRootIoc*/
/**
 * AnchoredMixin provides the ability to anchor a component to a position.
 * This mixin can be attached to a component via attached property syntax.
 *
 * To configure this mixin via attached property syntax, the configuration value
 * accepts a JSON string or POJO object with the following properties:
 *
 * - anchorX
 * - anchorY
 *
 * Both anchorX and anchorY can be a number which will anchor the owner component
 * to that local position. These properties can also be the string value 'global(N)'
 * where 'N' is a global number. If global is used then the owner component will be
 * anchored to a position relative to a global anchor.
 *
 * This mixin performs its behaviour by overriding the
 */
let nan = isNaN;
let toint = parseInt;
class AnchoredMixin {
  get anchorX() { return this._anchorX; }
  set anchorX(value) {
    if (value !== this._anchorX) {
      this._anchorX = value;
      if (this.owner && this.owner.parent) this.owner.parent.dirty = true;
      this._calcRequired = true;
    }
  }

  get anchorY() { return this._anchorY; }
  set anchorY(value) {
    if (value !== this._anchorY) {
      this._anchorY = value;
      if (this.owner && this.owner.parent) this.owner.parent.dirty = true;
      this._calcRequired = true;
    }
  }

  constructor() {
    this._anchorX = this._anchorY = NaN;
  }

  configure(value) {
    if (typeof value === 'string') {
      try {
        value = JSON.parse(value.replace(/'/g, '"'));
      } catch (err) {
        throw new Error('Failed to parse JSON string for AnchorMixin: ' + value);
      }
    }

    if (value && typeof value === 'object') {
      if ('anchorX' in value) this.anchorX = value.anchorX;
      if ('anchorY' in value) this.anchorY = value.anchorY;
    }
  }

  initialize() {
    let owner = this.owner;
    let self = this;
    Object.defineProperties(owner, {
      x: {
        configurable: true,
        enumerable: true,
        get() {
          if (self.anchorX === undefined) {
            return this._x;
          } else {
            return self.calculatePosition().x;
          }
        },
        set(value) {
          if (value !== this._x) {
            this._x = value;
            this.dirty = true;
          }
        }
      },
      y: {
        configurable: true,
        enumerable: true,
        get() {
          if (self.anchorY === undefined) {
            return this._y;
          } else {
            return self.calculatePosition().y;
          }
        },
        set(value) {
          if (value !== this._y) {
            this._y = value;
            this.dirty = true;
          }
        }
      }
    });
  }

  calculatePosition() {
    if (!this._calcRequired) return this._pos;
    let {anchorX, anchorY, owner} = this;
    let pos = { x: owner._x, y: owner._y };

    if (typeof anchorX === 'string' && anchorX.indexOf('global(') === 0 &&
      typeof anchorY === 'strig' && anchorY.indexOf('global(') === 0) {
      anchorX = toint(anchorX.substr(7).replace(')', ''), 10);
      anchorY = toint(anchorY.substr(7).replace(')', ''), 10);
      pos = owner.parent.globalToLocal(anchorX, anchorY);
    } else if (typeof anchorX === 'string' && anchorX.indexOf('global(') === 0) {
      anchorX = toint(anchorX.substr(7).replace(')', ''), 10);
      pos.x = owner.parent.globalToLocal(anchorX, 0).x;
      if (!nan(anchorY)) pos.y = anchorY;
    } else if (typeof anchorY === 'string' && anchorY.indexOf('global(') === 0) {
      anchorY = toint(anchorY.substr(7).replace(')', ''), 10);
      if (!nan(anchorX)) pos.x = anchorX;
      pos.y = owner.parent.globalToLocal(0, anchorY).y;
    } else {
      if (!nan(anchorX)) {
        pos.x = anchorX;
        this._calcRequired = false;
      }
      if (!nan(anchorY)) {
        pos.y = anchorY;
        this._calcRequired = false;
      }
    }

    return this._pos = pos;
  }

  lookUpCompnentByName(name) {
    let owner = this.owner;
    if (owner) {
      let c = owner;
      while (c && c.name !== name) {
        c = c.parent;
        if (c.parent === c) break;
      }
      return c;
    }
    return null;
  }
}

function relCoords(value) {
  return this.anchorX.split(/\(|\)/);
}

ComponentRootIoc.service('AnchoredMixin', AnchoredMixin);