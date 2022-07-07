## Buttons
You can use this class: `InSim.Buttons`. 
```js
InSim.Buttons.createSimple(player, name, group, width, height, top, left, text, style, inst); // create simple button
InSim.Buttons.createClick(player, name, group, width, height, top, left, text, style, inst, callback); // create clickable button
InSim.Buttons.createInput(player, name, group, width, height, top, left, text1, text2, style, callback, typeIn); // create input button
InSim.Buttons.delete(player, name, group); // delete button by NAME & GROUP for player
InSim.Buttons.deleteGroup(player, group); // delete buttons GROUP for player
```

## Example
```js
InSim.Events.on('Player:connect', (player) => {
    InSim.Buttons.createClick(player, 'example', 'example', 20, 4, 100, 100, 'this is example', 32, false, (player) => {
        // player clicked on button
    }); 
});

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
![image](https://user-images.githubusercontent.com/59031975/177845829-a8981dc2-10bb-457a-a371-2300172ad637.png)

## Text Colors
![image](https://user-images.githubusercontent.com/59031975/177845356-37f966de-0e99-41b1-9ef4-ddc289ae0d3d.png)