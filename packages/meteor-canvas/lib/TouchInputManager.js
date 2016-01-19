/*global TouchInputManager*/
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
    let listeners = this.getListeners('touchstart');
    listeners.push(listener);
    return this.createHandle(listener, listeners);
  }

  touchmove(listener) {
    let listeners = this.getListeners('touchmove');
    listeners.push(listener);
    return this.createHandle(listener, listeners);
  }

  touchend(listener) {
    let listeners = this.getListeners('touchend');
    listeners.push(listener);
    return this.createHandle(listener, listeners);
  }

  touchcanel(listener) {
    let listeners = this.getListeners('touchcanel');
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