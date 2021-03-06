/*global Package*/
Package.describe({
  name: 'dschnare:meteor-canvas',
  version: '0.4.0',
  // Brief, one-line summary of the package.
  summary: 'A set of meteor-components that render to an HTML5 canvas',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/dschnare/meteor-canvas',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.use('templating', 'client');
  api.use('dschnare:meteor-components-ioc-plugin@0.5.1', 'client');
  api.use('dschnare:meteor-components@0.12.0', 'client');
  api.use('dschnare:ioc-container@1.2.1', 'client');
  api.addFiles([
// support files
    'lib/zSort.js',
    'lib/Rect.js',
    'lib/requestRender.js',
    'lib/getDevicePixelRatio.js',
    'lib/measureText.js',
    'lib/CanvasComponent.js',
    'lib/Buffer2d.js',
    'lib/MouseInputManager.js',
    'lib/TouchInputManager.js',
// templates
    'templates/Layer.html',
    'templates/CanvasComponent.html',
// mixins
    'mixins/BorderMixin.js',
    'mixins/MouseableMixin.js',
    'mixins/TouchableMixin.js',
    'mixins/AnchoredMixin.js',
// exports
    'meteor-canvas.js',
// components
    'components/Layer.js', // Layer uses MeteorCanvas.requestRender
    'components/TextField.js',
    'components/Image.js',
    'components/Group.js',
    'components/ClippingGroup.js',
    'components/HorizontalStack.js',
    'components/VerticalStack.js'
  ], 'client');
  api.export([
    'MeteorCanvas'
  ], 'client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('dschnare:meteor-canvas');
  api.addFiles('meteor-canvas-tests.js');
});
