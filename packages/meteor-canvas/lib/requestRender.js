/*global requestRender*/
// Function that makes a request to the browser to perform a render call.
requestRender = (render) => {
  if (window.requestAnimationFrame) {
    window.requestAnimationFrame(render);
  } else {
    window.setTimeout(render, 0.016666);
  }
};