# 0.3.2

**Jan. 25, 2016**

chore(CanvasComponent) Split blitting phase into own method

The blitting phase is now split into its own method. This will make it easier
for mixins to potentially override how components are blitted to the canvas.

Update dependencies so that IOC container and meteor-components is tracked
properly.


# 0.3.1

**Jan. 22, 2016**

feat(localToGlobal) Add localToGlobal method to components

Implement localToGlobal() method for all canvas components.


# 0.3.0

**Jan. 22, 2016**

refactor(mixins) Rename and clean up input mixins

Rename TouchInputMixin to TouchableMixin and MouseInputMixin to MouseableMixin.
Clean up redundant code in TouchInputManager and MouseInputManager.

Export TouchableMixin and TouchInputManager and also register TouchableMixin
and MousableMixin on ComponentRootIoc so they can be attached to components
using attached properties.


# 0.2.1

**Jan. 20, 2016**

fix(Group, ClippingGroup) Override dirty property properly

Override the dirty property setter. This is required due to how classes work.


# 0.2.0

**Jan. 20, 2016**

feat(ClippingGroup) Implement ClippingGroup component

Implement ClippingGroup component that acts much like a Group component but
must have the width and height set so that the children will be clipped.


# 0.1.3

**Jan. 20, 2016**

chore(CanvasComponent, Layer) Only render visible child components

Only render child components that are contained within the bounds of the canvas
being controlled by a Layer. Separate the measure phase from the render phase
so that component measurements are calculated before render is called.

Implement Rect#intersects to determine if two rectangles are intersecting.


# 0.1.2

**Jan. 19, 2016**

chore(TouchInputManager) Conditionally add touch events if touch is supported


# 0.1.1

**Jan. 19, 2016**

fix(package.js) Add missing dependencies

Add the missing TouchInputMixin and TouchInputManager dependencies.


# 0.1.0

**Jan. 19, 2016**

feat(TouchInputMixin) Add TouchInputMixin

Add TouchInputMixin and accompanying TouchInputManager. This mixin will
call touchstart(), touchmove(), touchend() and touchcancel() if they exist
on a component and a user has touched the component's area on the screen.


# 0.0.32

**Jan. 13, 2016**

fix(package.js) Fix dependency name in tests


# 0.0.31

**Jan. 13, 2016**

fix(package.js) Fix dependency name in tests


# 0.0.3

**Jan. 13, 2016**

docs(HISTORY, LICENSE) Create HISTORY.md and copy LICENSE to package


# 0.0.2

**Jan. 13, 2016**

docs(README) Resolve syntax issues


# 0.0.1

**Jan. 13, 2016**

feature(First commit) First commit