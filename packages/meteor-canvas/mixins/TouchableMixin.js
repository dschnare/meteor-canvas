/*global TouchableMixin, ComponentRootIoc*/
// A mixin that will add the ability of a component to define a touchstart, touchmove
// or touchend methods that will be called when the canvas element has been touched.
TouchableMixin = class {
  constructor() {
    this.subscriptions = [];
  }

  ready() {
    this.canvas = this.owner.firstNode().parentNode;
    let tm = TouchInputManager.instance();

    if (typeof this.owner.touchstart === 'function') {
      this._setupTouchEvent(
        tm.touchstart.bind(tm),
        this.owner.touchstart.bind(this.owner)
      );
    }

    if (typeof this.owner.touchmove === 'function') {
      this._setupTouchEvent(
        tm.touchmove.bind(tm),
        this.owner.touchmove.bind(this.owner)
      );
    }

    if (typeof this.owner.touchend === 'function') {
      this._setupTouchEvent(
        tm.touchend.bind(tm),
        this.owner.touchend.bind(this.owner)
      );
    }

    if (typeof this.owner.touchcancel === 'function') {
      this._setupTouchEvent(
        tm.touchcancel.bind(tm),
        this.owner.touchcancel.bind(this.owner)
      );
    }
  }

  destroy() {
    if (this.canvas) {
      this.canvas = null;
      while (this.subscriptions.length) {
        this.subscriptions.pop().destroy();
      }
    }
  }

  _setupTouchEvent(eventEmitterFn, lifecycleCallback) {
    this.subscriptions.push(
      eventEmitterFn((event) => {
        if (this.owner) {
          let touches = this._getTouchesOverComponent(event.changedTouches);
          if (touches.length) {
            lifecycleCallback(event, touches);
          }
        }
      })
    );
  }

  _getTouchesOverComponent(touches) {
    let extent = this.owner.extent;
    return touches.filter((touch) => {
      return extent.containsPoint(this._toLocalPosition(touch));
    });
  }

  _toLocalPosition(touch) {
    if (!this.canvas) return { x: -1, y: -1 };
    let r = this.canvas.getBoundingClientRect();
    return {
      x: touch.clientX - r.left,
      y: touch.clientY - r.top
    };
  }
};

// Register the TouchableMixin so that it can be attached to components
// using attached property syntax.
ComponentRootIoc.service('TouchableMixin', TouchableMixin);