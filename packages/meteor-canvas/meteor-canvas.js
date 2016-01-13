/*global MeteorCanvas*/
// Export parts of the package API.
MeteorCanvas = {
  Buffer2d: Buffer2d,
  CanvasComponent: CanvasComponent,
  Rect: Rect,
  MouseInputManager: MouseInputManager,
  requestRender: requestRender,

  mixins: {
    BorderMixin: BorderMixin,
    MouseInputMixin: MouseInputMixin
  }
};