/*global MouseInputManager*/
// Singleton that handles interfacing with the mouse.
MouseInputManager = class {
  static instance() {
    return this._instance || (this._instance = new MouseInputManager());
  }

  constructor(el=null) {
    if (MouseInputManager._instance) {
      throw new Error('MouseManager is a singleton.'
        + ' Use MouseManager.instance().');
    }

    this.listeners = {};
    this.el = el || document.body;
  }

  click(listener) {
    return this.listen('click', listener);
  }

  mousemove(listener) {
    return this.listen('mousemove', listener);
  }

  listen(eventType, listener) {
    let listeners = this.getListeners(eventType);
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