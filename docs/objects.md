## Objects
You can use objects through this class: `InSim.Objects`. 
```js
InSim.Objects.all(hostName | false); // get objects in specified host || or all objects in all hosts
InSim.Objects.add(hostName, objects | object); // add objects | object
InSim.Objects.remove(hostName, objects | object); // remove objects | object
InSim.Objects.move(hostName, object1, object2); // move object1 to object2
await InSim.Objects.addAsync(hostName, objects); // add objects with async
await InSim.Objects.removeAsync(hostName, objects); // remove objects with async
```

## Example
```js
// connected to host
InSim.Packets.on('IS_VER', (data) => {
    // wait for a little, because InSim.Objects not initialized for host
    setTimeout(async () => {
        // add one object
        InSim.Objects.add(data.hostName, { x: -10734, y: -31282, z: 8, flags: 0, index: 144, heading: 128 });
        
        // remove one object
        InSim.Objects.remove(data.hostName, { x: -10734, y: -31282, z: 8, flags: 0, index: 144, heading: 128 });
        
        // add two objects
        InSim.Objects.add(data.hostName, [ { x: -10734, y: -31282, z: 8, flags: 0, index: 144, heading: 128 }, { x: -10750, y: -31280, z: 8, flags: 0, index: 144, heading: 128 }] );
        
        // remove two objects
        InSim.Objects.remove(data.hostName, [ { x: -10734, y: -31282, z: 8, flags: 0, index: 144, heading: 128 }, { x: -10750, y: -31280, z: 8, flags: 0, index: 144, heading: 128 }] );
        
        // add two objects async
        // async method required async before callback
        const result1 = await InSim.Objects.addAsync(data.hostName, [ { x: -10734, y: -31282, z: 8, flags: 0, index: 144, heading: 128 }, { x: -10750, y: -31280, z: 8, flags: 0, index: 144, heading: 128 }] );
        if(result1) {
            console.log('objects added');
        }
        
        // remove two objects async
        // async method required async before callback
        const result2 = await InSim.Objects.removeAsync(data.hostName, [ { x: -10734, y: -31282, z: 8, flags: 0, index: 144, heading: 128 }, { x: -10750, y: -31280, z: 8, flags: 0, index: 144, heading: 128 }] );
        if(result2) {
            console.log('objects removed');
        }
    }, 500);
});
```

## Objects List
| Index                     | Name                        |
| ------------------------- | -------------------------------- |
| 0 | AXO_NULL |
| 4 | AXO_CHALK_LINE |
| 5 | AXO_CHALK_LINE2 |
| 6 | AXO_CHALK_AHEAD |
| 7 | AXO_CHALK_AHEAD2 |
| 8 | AXO_CHALK_LEFT |
| 9 | AXO_CHALK_LEFT2 |
| 10 | AXO_CHALK_LEFT3 |
| 11 | AXO_CHALK_RIGHT |
| 12 | AXO_CHALK_RIGHT2 |
| 13 | AXO_CHALK_RIGHT3 |
| 20 | AXO_CONE_RED |
| 21 | AXO_CONE_RED2 |
| 22 | AXO_CONE_RED3 |
| 23 | AXO_CONE_BLUE |
| 24 | AXO_CONE_BLUE2 |
| 25 | AXO_CONE_GREEN |
| 26 | AXO_CONE_GREEN2 |
| 27 | AXO_CONE_ORANGE |
| 28 | AXO_CONE_WHITE |
| 29 | AXO_CONE_YELLOW |
| 30 | AXO_CONE_YELLOW2 |
| 40 | AXO_CONE_PTR_RED |
| 41 | AXO_CONE_PTR_BLUE |
| 42 | AXO_CONE_PTR_GREEN |
| 43 | AXO_CONE_PTR_YELLOW |
| 48 | AXO_TYRE_SINGLE |
| 49 | AXO_TYRE_STACK2 |
| 50 | AXO_TYRE_STACK3 |
| 51 | AXO_TYRE_STACK4 |
| 52 | AXO_TYRE_SINGLE_BIG |
| 53 | AXO_TYRE_STACK2_BIG |
| 54 | AXO_TYRE_STACK3_BIG |
| 55 | AXO_TYRE_STACK4_BIG |
| 64 | AXO_MARKER_CURVE_L |
| 65 | AXO_MARKER_CURVE_R |
| 66 | AXO_MARKER_L |
| 67 | AXO_MARKER_R |
| 68 | AXO_MARKER_HARD_L |
| 69 | AXO_MARKER_HARD_R |
| 70 | AXO_MARKER_L_R |
| 71 | AXO_MARKER_R_L |
| 72 | AXO_MARKER_S_L |
| 73 | AXO_MARKER_S_R |
| 74 | AXO_MARKER_S2_L |
| 75 | AXO_MARKER_S2_R |
| 76 | AXO_MARKER_U_L |
| 77 | AXO_MARKER_U_R |
| 84 | AXO_DIST25 |
| 85 | AXO_DIST50 |
| 86 | AXO_DIST75 |
| 87 | AXO_DIST100 |
| 88 | AXO_DIST125 |
| 89 | AXO_DIST150 |
| 90 | AXO_DIST200 |
| 91 | AXO_DIST250 |
| 96 | AXO_ARMCO1 |
| 97 | AXO_ARMCO3 |
| 98 | AXO_ARMCO5 |
| 104 | AXO_BARRIER_LONG |
| 105 | AXO_BARRIER_RED |
| 106 | AXO_BARRIER_WHITE |
| 112 | AXO_BANNER1 |
| 113 | AXO_BANNER2 |
| 120 | AXO_RAMP1 |
| 121 | AXO_RAMP2 |
| 128 | AXO_SPEED_HUMP_10M |
| 129 | AXO_SPEED_HUMP_6M |
| 136 | AXO_POST_GREEN |
| 137 | AXO_POST_ORANGE |
| 138 | AXO_POST_RED |
| 139 | AXO_POST_WHITE |
| 144 | AXO_BALE |
| 148 | AXO_RAILING |
| 149 | AXO_START_LIGHTS |
| 160 | AXO_SIGN_KEEP_LEFT |
| 161 | AXO_SIGN_KEEP_RIGHT |
| 168 | AXO_SIGN_SPEED_80 |
| 169 | AXO_SIGN_SPEED_50 |
| 172 | AXO_CONCRETE_SLAB |
| 173 | AXO_CONCRETE_RAMP |
| 174 | AXO_CONCRETE_WALL |
| 175 | AXO_CONCRETE_PILLAR |
| 176 | AXO_CONCRETE_SLAB_WALL |
| 177 | AXO_CONCRETE_RAMP_WALL |
| 178 | AXO_CONCRETE_SHORT_SLAB_WALL |
| 179 | AXO_CONCRETE_WEDGE |
| 184 | AXO_START_POSITION |
| 185 | AXO_PIT_START_POINT |
| 186 | AXO_PIT_STOP_BOX |

> More info you can find [https://www.lfs.net/programmer/lyt](https://www.lfs.net/programmer/lyt)