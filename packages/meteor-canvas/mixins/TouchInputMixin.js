/*global TouchInputMixin*/
// A mixin that will add the ability of a component to define a touchstart, touchmove
// or touchend methods that will be called when the canvas element has been touched.
TouchInputMixin = class {
  constructor() {
    this.subscriptions = [];
  }

  ready() {
    this.canvas = this.owner.firstNode().parentNode;

    if (typeof this.owner.touchstart === 'function') {
      this.subscriptions.push(
        TouchInputManager.instance().touchstart((event) => {
          if (this.owner) {
            let touches = this.getTouchesOverComponent(event.changedTouches);
            if (touches.length) {
              this.owner.touchstart(event, touches);
            }
          }
        })
      );
    }

    if (typeof this.owner.touchmove === 'function') {
      this.subscriptions.push(
        TouchInputManager.instance().touchmove((event) => {
          if (this.owner) {
            let touches = this.getTouchesOverComponent(event.changedTouches);
            if (touches.length) {
              this.owner.touchmove(event, touches);
            }
          }
        })
      );
    }

    if (typeof this.owner.touchend === 'function') {
      this.subscriptions.push(
        TouchInputManager.instance().touchend((event) => {
          if (this.owner) {
            let touches = this.getTouchesOverComponent(event.changedTouches);
            if (touches.length) {
              this.owner.touchend(event, touches);
            }
          }
        })
      );
    }

    if (typeof this.owner.touchcancel === 'function') {
      this.subscriptions.push(
        TouchInputManager.instance().touchcancel((event) => {
          if (this.owner) {
            let touches = this.getTouchesOverComponent(event.changedTouches);
            if (touches.length) {
              this.owner.touchcancel(event, touches);
            }
          }
        })
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

  getTouchesOverComponent(touches) {
    let extent = this.owner.extent;
    return touches.filter((touch) => {
      return extent.containsPoint(this.toLocalPosition(touch));
    });
  }

  toLocalPosition(touch) {
    if (!this.canvas) return { x: -1, y: -1 };
    let r = this.canvas.getBoundingClientRect();
    return {
      x: touch.clientX - r.left,
      y: touch.clientY - r.top
    };
  }
};