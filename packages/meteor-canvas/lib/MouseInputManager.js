/*global MouseInputManager*/
// Singleton that handles interfacing with the mouse.
MouseInputManager = class {
  static instance() {
    return this._instance || (this._instance = new MouseInputManager());
  }

  constructor(el) {
    if (MouseInputManager._instance) {
      throw new Error('MouseManager is a singleton.'
        + ' Use MouseManager.instance().');
    }

    this.listeners = {};
    this.el = el || document.body;
  }

  click(listener) {
    let listeners = this.getListeners('click');
    listeners.push(listener);
    return this.createHandle(listener, listeners);
  }

  mousemove(listener) {
    let listeners = this.getListeners('mousemove');
    listeners.push(listener);
    return this.createHandle(listener, listeners);
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