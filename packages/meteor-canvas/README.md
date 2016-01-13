# Overview

Meteor Canvas is a set of [meteor-components](https://atmospherejs.com/dschnare/meteor-components) built using that render to an HTML5 canvas.


# Quick Start

**WARNING: API IS STILL CHANGING**

    <body>
      {{#Layer}}
        {{> TextField text="Hello World" padding=10 borderThickness=1}}
      {{/Layer}}
    </body>


# Creating a custom component

A canvas component is created the same way as usual, only there are now a few
more methods you can override and you also must extend `CanvasComponent`. The
following shows a few patterns that can be followed when creating your own
components.

    Component.MyComponent = class extends CanvasComponent {
      // All canvas components need to use the CanvasComponent template.
      static template() { return 'CanvasComponent'; }

      // This is a typical pattern all canvas components use to mark themselves
      // as being dirty when a property changes. If the property requires the
      // comoponent to update the back buffer then we set the dirty property.
      get someProp() { return this._someProp; }
      set someProp(value) {
        if (value !== this._someProp) {
          this._someProp = value;
          this.dirty = true;
        }
      }

      initialize() {
        // This is where you would typically initialize your properties from
        // the data context. Be sure to wrap each call to this.data() in an
        // autorun so the properties will be updated when the data context
        // values change.

        this.autorun(() => this.someProp = this.data('someProp'));
      }

      size() {
        // If you are in fact drawing something to the back buffer
        // then we need to provide the measurements for this content.

        return { width: 100, height: 100 };
      }

      updateBackBuffer(backBuffer) {
        // Grab the content extent that indicates where in the back
        // buffer we can draw to (i.e. inside the padding).

        let {x, y, width, height} = this.contentExtent;

        // Do your drawing.

        backBuffer.draw(something, x, y, width, height);
      }
    }