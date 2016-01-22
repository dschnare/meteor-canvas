/*global MeteorCanvas*/
// Export parts of the package API.
MeteorCanvas = {
  Buffer2d: Buffer2d,
  CanvasComponent: CanvasComponent,
  Rect: Rect,
  MouseInputManager: MouseInputManager,
  TouchInputManager: TouchInputManager,
  requestRender: requestRender,

  mixins: {
    BorderMixin: BorderMixin,
    MouseableMixin: MouseableMixin,
    TouchableMixin: TouchableMixin
  }
};