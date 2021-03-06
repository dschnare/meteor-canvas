/*global TouchInputManager*/

function hasTouchSupport() {
  return 'ontouchstart' in document.documentElement;
}

// Singleton that handles interfacing with touch.
TouchInputManager = class {
  static instance() {
    return this._instance || (this._instance = new TouchInputManager());
  }

  constructor(el=null) {
    if (TouchInputManager._instance) {
      throw new Error('TouchInputManager is a singleton.'
        + ' Use TouchInputManager.instance().');
    }

    this.listeners = {};
    this.el = el || document.body;
  }

  touchstart(listener) {
    return this.listen('touchstart', listener);
  }

  touchmove(listener) {
    return this.listen('touchmove', listener);
  }

  touchend(listener) {
    return this.listen('touchend', listener);
  }

  touchcancel(listener) {
    return this.listen('touchcancel', listener);
  }

  listen(eventType, listener) {
    if (hasTouchSupport()) {
      let listeners = this.getListeners(eventType);
      listeners.push(listener);
      return this.createHandle(listener, listeners);
    } else {
      return { destroy: () => {} };
    }
  }

  getListeners(eventType) {
    let listeners = this.listeners[eventType];
    if (!listeners) {
      listeners = this.listeners[eventType] = [];
      let fn = this[`_${eventType}Listener`] = (event) => {
        for (let listener of listeners) {
          listener(event);
        }
      };
      this.el.addEventListener(eventType, fn);
    }
    return listeners;
  }

  createHandle(listener, listeners) {
    let destroyed = false;
    return {
      destroy() {
        if (!destroyed) {
          destroyed = true;
          let k = listeners.indexOf(listener);
          listeners.splice(k, 1);
        }
      }
    };
  }

  destroy() {
    if (this.el) {
      for (let eventType in this.listeners) {
        this.el.removeEventListener(eventType, this[`_${eventType}Listener`]);
      }
      this.listeners = [];
      this.el = null;
    }
  }
};