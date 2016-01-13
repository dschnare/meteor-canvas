/*global getDevicePixelRatio*/
getDevicePixelRatio = () => {
// See: http://bit.ly/1Q0oZhX
  var ctx = document.createElement('canvas').getContext('2d'),
      dpr = window.devicePixelRatio || 1,
      bsr = ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1;

  return dpr / bsr;
};