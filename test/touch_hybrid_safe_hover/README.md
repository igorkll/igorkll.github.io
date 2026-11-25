# touch_hybrid_safe_hover
## An alternative implementation of hover in JavaScript that works correctly on devices with a mouse, touchscreens, and hybrid devices that have both a mouse and a touchscreen.

### enable
```js
import * as touch_hybrid_safe_hover from './touch_hybrid_safe_hover.js';
touch_hybrid_safe_hover.enable();
```

### classes
* "touch_hybrid_safe_hover-ts_active" - When using a mouse, it works like a regular hover. when using a touchscreen or stylus, it triggers when the finger is on the element. The class will disappear immediately if you move your finger from the element (Even if you don’t release your finger from the screen, just move it). It will appear ONLY if the click occurred within the element (this is what distinguishes this class from the next one).
* "touch_hybrid_safe_hover-ts_hover" - When using a mouse, it works like a regular hover. When using a touch screen or stylus, it appears when the finger is above the element and disappears when the finger moves outside the element. It appears even if the click actually occurred outside the element and then the finger moved onto the element. this allows you to implement the logic where you press your finger on the touch screen, move it to the desired element (and they bounce while you drag your finger across the screen), and then the correct one is selected when you release your finger on it.
* "touch_hybrid_safe_hover-ts_none" - When using a mouse, it works like a regular hover. it doesn't work on the touchscreen or pen at all
* "touch_hybrid_safe_hover-ts_active-bubble" - It works as the first alternative, it just pops up.
* "touch_hybrid_safe_hover-ts_hover-bubble" - It works as the first alternative, it just pops up.
* "touch_hybrid_safe_hover-ts_none-bubble" - It works as the first alternative, it just pops up.

### functions
* enable - activates the library
* disable - deactivates the library
* isEnabled - returns true if the library is activated
* getLastInteractionType - null / "mouse" / "touch" / "pen"
