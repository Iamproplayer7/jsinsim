## Buttons
You can use buttons through this class: `InSim.Buttons`. 
```js
// create simple button
InSim.Buttons.createSimple(player, name, group, width, height, top, left, text, style, inst);

// create click button
InSim.Buttons.createClick(player, name, group, width, height, top, left, text, style, inst, callback);

// create input button
InSim.Buttons.createInput(player, name, group, width, height, top, left, text1, text2, style, callback, typeIn);
```

## Arguments
| Argument                  |  Info                                          |
| ------------------------- | ---------------------------------------------- |
| `player`            | player to create button for                       |
| `name`            | button name (used in Library)                 |
| `group` | button group (used in Library)                    |
| `width` | button width (0-200)                  |
| `height` | button height (0-200)                  |
| `top` | button position screen y-axis (0-200)                  |
| `left` | button position screen x-axis (0-200)                  |
| `text` | text for button (max: 95 length)                  |
| `text1` | (only for input button): text when player clicks button                 |
| `text2` | (only for input button): text before player click                |
| `style` | see below `Styles`                  |
| `inst` | `true` \| `false`, `true` means you can see button when pressed ESC or etc.                |
| `callback` | callback executed when player clicks button or inputs text                |
| `typeIn` | (only for input button): max input for text                |

## Styles
![image](https://user-images.githubusercontent.com/59031975/177833621-32b9cc9c-7439-4dfa-a28c-cff266cd7774.png)

