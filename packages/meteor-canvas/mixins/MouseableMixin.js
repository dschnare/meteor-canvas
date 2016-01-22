/*global MouseableMixin, ComponentRootIoc*/
// A mixin that will add the ability of a component to define a click, rollOver
// or rollOut methods that will be called when clicked, the mouse rolls over or
// rolls off of the component on the canvas element.
MouseableMixin = class {
  constructor() {
    this.subscriptions = [];
  }

  ready() {
    this.canvas = this.owner.firstNode().parentNode;

    if (typeof this.owner.click === 'function') {
      this.subscriptions.push(
        MouseInputManager.instance().click((event) => {
          if (this.owner) {
            let mp = this.getMousePosition(event);
            if (this.owner.extent.containsPoint(mp)) {
              this.owner.click(event);
            }
          }
        })
      );
    }

    if (typeof this.owner.rollOver === 'function' ||
      typeof this.owner.rollOut === 'function') {
      this.subscriptions.push(
        MouseInputManager.instance().mousemove((event) => {
          if (this.owner) {
            let mp = this.getMousePosition(event);
            let isOver = this.owner.extent.containsPoint(mp);

            if (!this._over && isOver) {
              this._over = true;
              if (this.owner.rollOver) this.owner.rollOver(event);
            } else if (this._over && !isOver) {
              this._over = false;
              if (this.owner.rollOut) this.owner.rollOut(event);
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

  getMousePosition(mouseEvent) {
    if (!this.canvas) return { x: -1, y: -1 };
    let r = this.canvas.getBoundingClientRect();
    return {
      x: mouseEvent.clientX - r.left,
      y: mouseEvent.clientY - r.top
    };
  }
};

// Register the MousableMixin so it can be attached via
// attached properties on other components.
ComponentRootIoc.service('MouseableMixin', MouseableMixin);