## Mods
You can use this class: `InSim.Mods`. 
```js
InSim.Mods.all(); // return loaded mods array
InSim.Mods.loadFile(filePath); // load mods file (if file not found, file will be created)
InSim.Mods.add(skinId | array of skinIds); // add mod
InSim.Mods.remove(skinId | array of skinIds); // remove mod
```

> this class not linked to the mods added with host command /mods. (this will be updated soon.)

## Example
```js
// load mods from file and activate it (all added/removed mods will be added/removed from that file)
InSim.Mods.loadFile('./mods.list');

InSim.Mods.add('CCFEC6');
InSim.Mods.add('6FB5F5');
// or
InSim.Mods.add(['CCFEC6', '6FB5F5']);
```

> Mod list you can find at [https://www.lfs.net/files/vehmods](https://www.lfs.net/files/vehmods)