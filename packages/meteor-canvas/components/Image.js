/*global Component*/
let ImageState = {
  None: 'none',
  Loading: 'loading',
  Loaded: 'loaded'
};

let ImageStretch = {
  Fill: 'fill',
  None: 'none',
  Uniform: 'uniform',
  UniformToFill: 'uniformToFill',

  $isValid(value) {
    for (let name in this) {
      if (name.charAt(0) === '$') continue;
      if (this[name] === value) return true;
    }
    return false;
  }
}

Component.Image = class extends CanvasComponent {
  static template() { return 'CanvasComponent' }

  get src() { return this._src; }
  set src(value) {
    if (value !== this._src) {
      this._src = value;
      this.dirty = true;
      this.load();
    }
  }

  get stretch() { return this._stretch; }
  set stretch(value) {
    if (value !== this._stretch) {
      if (ImageStretch.$isValid(value)) {
        this._stretch = value;
        this.dirty = true;
      } else {
        throw new Error('Invalid stretch value being set: ' + value);
      }
    }
  }

  get state() { return this._state; }

  constructor() {
    super();

    this.loader_loadHandler = () => {
      this._state = ImageState.Loaded;
      this.dirty = true;
    };

    this.loader_errorHandler = () => {
      throw new Error('Failed to load image: ' + this._src);
    };
  }

  initialize() {
    super.initialize();

    this._state = ImageState.None;
    this.autorun(() => this.src = this.data('src') || '');
    this.autorun(
      () => this.stretch = this.data('stretch') || ImageStretch.Uniform
    );
  }

  load() {
    if (this._src && (!this._loader || this._loader.src !== this._src)) {
      if (!this._loader) {
        this._loader = new Image();
        this._loader.addEventListener('load', this.loader_loadHandler);
        this._loader.addEventListener('error', this.loader_errorHandler);
      }

      this._loader.src = this._src;
      this._state = ImageState.Loading;
    }
  }

  size() {
    if (this.state === ImageState.Loaded) {
      return { width: this._loader.width, height: this._loader.height };
    } else {
      return { width: 0, height: 0 };
    }
  }

  updateBackBuffer(backBuffer) {
    // Modelled after System.Windows.Media.Stretch.
    // See http://bit.ly/1F6x0db
    if (this.state === ImageState.Loaded) {
      let {x: cx, y: cy, width: cWidth, height: cHeight} = this.contentExtent;
      let contentAspect = cWidth/cHeight;
      let {width: imgWidth, height: imgHeight} = this._loader;
      let imgAspect = imgWidth/imgHeight;
      let x, y, width, height;

      switch (this._stretch) {
        case ImageStretch.None:
          width = imgWidth;
          height = imgHeight;
          x = (cWidth - width) / 2;
          y = (cHeight - height) / 2;
          break;
        case ImageStretch.Fill:
          x = 0;
          y = 0;
          width = cWidth;
          height = cHeight;
          break;
        case ImageStretch.Uniform:
          if (imgWidth > imgHeight) {
            width = cWidth;
            height = imgHeight/imgWidth * cWidth;
            x = 0;
            y = (cHeight - height) / 2;
          } else {
            width = imgWidth/imgHeight * cHeight;
            height = cHeight;
            x = (cWidth - width) / 2;
            y = 0;
          }
          break;
        case ImageStretch.UniformToFill:
          if (imgWidth > imgHeight) {
            height = contentAspect > imgAspect ?
              contentAspect / imgAspect * cHeight : cHeight;
            width = imgWidth/imgHeight * height;
            x = (cWidth - width) / 2;
            y = (cHeight - height) / 2;
          } else {
            width = contentAspect > imgAspect ?
              contentAspect / imgAspect * cWidth : cWidth;
            height = imgHeight/imgWidth * width;
            x = (cWidth - width) / 2;
            y = (cHeight - height) / 2;
          }
          break;
      }

      backBuffer.draw(this._loader, x + cx, y + cy, width, height);
    }
  }

  destroy() {
    if (this._loader) {
      this._loader.removeEventListener('load', this.loader_loadHandler);
      this._loader.removeEventListener('error', this.loader_errorHandler);
      this._loader = null;
    }
  }
};