# LED Cube Programming Interface

This program will be used for creating animated patterns for LED Light Cubes.

## Display
- Blue dots are **lit LEDS**
- Gray/transparent dots are **unlit LEDS**

## Inputs
### Mouse
- Click on lights in the selected layer to turn them on or off for the current frame
- Change the frame by using the slider at the bottom (10 total frames available).

### Keyboard
- _x/y/z/a_ -> switch between viewing layers on different axes
  - You can only toggle lights on the selected layer on the current axis
  - _'a'_ is 'all' axes. In this mode, all layers are selected but you cannot toggle lights
- _arrow keys_ -> select a different layer in x/y/z axis modes
  - _up/down_ changes selected layer in _y_ axis mode
  - _right/left_ changes selected layer in _x/z_ axis modes
- _spacebar_-> toggle 'play' mode. Play mode progresses through frames automatically at 1 fps.
  - 'all' axis mode is enforced when playing
- _'[/]'_ -> changes current frame
  - _'[' will switch to the previous frame; ']' switches to the next frame
