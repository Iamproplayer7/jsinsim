## Events
You can use this class: `InSim.Events`. 
```js
InSim.Events.on(name, callback: (...args)); // register listener for event
InSim.Events.fire(name, ...args); // fire event listener
```

## Custom Events
```js
InSim.Events.on('test', (arg1, arg2) => {
    console.log(arg1, arg2);
    // testing, 145.
});

// fire
InSim.Events.fire('test', 'testing', 145);
```

# Events List
## Usage
You can listen to all events from this List:
```js
InSim.Events.on('Player:connect', (player) => {
    player.message('Welcome to the server!');
});
```

## Player
| Event                     | Arguments           | Info                                           |
| ------------------------- | ------------------- | ---------------------------------------------- |
| Player:connect            | `player`            | player connected to host                       |
| Player:disconnect         | `player`, `reason`            | player disconnected from host                  |
| Player:message            | `player`, `message` | player sent message to chat                    |
| Player:vote            | `player`, `action` | player voted                    |
| Player:penalty            | `player`, `penalty` | player got penalty                    |
| Player:takeOver            | `player1`, `player2` | player took over                    |
| Player:pnameUpdate            | `player`, `data` | player name update (old, new)                    |

## Vehicle
| Event                     | Arguments           | Info                                           |
| ------------------------- | ------------------- | ---------------------------------------------- |
| Vehicle:joinRequest               | `data`           | player requesting to join into track                          |
| Vehicle:add               | `vehicle`           | player joined a track                          |
| Vehicle:remove            | `vehicle`           | player left a track                            |
| Vehicle:reset             | `vehicle`           | player reseted a vehicle                       |
| Vehicle:info              | `vehicle`           | vehicle info is updated (pps times per second) |
| Vehicle:objectHit              | `vehicle`, `info`           | vehicle hits object |
| Vehicle:contact              | `vehicle1`, `vehicle2`, `info1`, `info2`           | vehicle hits other vehicle |
| Vehicle:plateUpdate              | `vehicle`, `data`           | vehicle number plate update (old, new) |

## Buttons
| Event                     | Arguments                        | Info                                           |
| ------------------------- | -------------------------------- | ---------------------------------------------- |
| Buttons:click             | `player`, `button`, `click info` | player clicked a clickable button              |
| Buttons:text              | `player`, `button`, `text`       | player inputed a text to input button          |
| Buttons:shiftI            | `player`                         | player pressed shift+i to reset buttons        |

## Mods
| Event                     | Arguments                        | Info                                           |
| ------------------------- | -------------------------------- | ---------------------------------------------- |
| Mods:load                 | `list`                           | config file is loaded                          |
| Mods:add                  | `id`                             | mod is added                                   |
| Mods:remove               | `id`                             | mod is removed                                 |

## Objects
| Event                     | Arguments                        | Info                                           |
| ------------------------- | -------------------------------- | ---------------------------------------------- |
| Objects:add               | `hostName`, `player`, `object`   | object is added                                |
| Objects:update               | `hostName`, `player`, `object`   | object is updated                                |
| Objects:remove            | `hostName`, `player`, `object`   | object is removed                              |
| Objects:clear             | `hostName`, `player`             | objects are cleared                            |
