/*global measureText*/
// Measures the boudning box of a string given the specified font family,
// font size and line height. This is necessary so we can resize our
// back buffer to the size we need.
let ceil = Math.round;
measureText = (text, fontFamily, fontSize, lineHeight) => {
  var w, h, div = measureText.div || document.createElement('div');
  div.style.font = fontSize + '/' + lineHeight + ' ' + fontFamily;
  div.style.padding = '0';
  div.style.margin = '0';
  div.style.position = 'absolute';
  div.style.top = '-9999px';
  div.innerHTML = text;
  if (!measureText.div) document.body.appendChild(div);
  w = div.clientWidth;
  h = div.clientHeight;
  measureText.div = div;
  return { width: ceil(w), height: ceil(h) };
}