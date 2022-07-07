# jsinsim
A InSim library for online racing simulator [Live For Speed](https://www.lfs.net/) written in javascript runtime Node.js. 
<br/>This library allows you to connect to the game server and share packets trought TCP stream.

## Requirements
The library requires [Node.js runtime](https://nodejs.org/en/) 
<br/>(you can download and install by following official website).

## Installation
Clone this library from github [here](https://github.com/Iamproplayer7/jsinsim/archive/refs/heads/main.zip) and extract it in selected directory. 
<br/><br/>Run following command inside directory to install required dependencies:
<br/>`npm install`

## Documentation
[InSim.Events](https://github.com/Iamproplayer7/jsinsim/blob/main/docs/events.md)

## InSim
This is simple example how to start your first program.<br/>
Create a file named <b>index.js</b> and copy this code there and save it:<br/>
```js
// import InSim library
const InSim = require('./module/insim');

// init InSim connection
InSim.Server.start({
    host: { // host name used only in module
        ip: '127.0.0.1', // your host ip
        port: 53330,     // your host port
        admin: 'testas', // your host admin password
        prefix: '!',     // command prefix like (-> !command)
        pps: 12          // vehicle info update per second (max: 12)
    }
}, (hostName) => { // host name defined above
    InSim.Server.message(hostName, '^2InSim: Node.js connected.');
});
```
Run command `node index.js`. You will see this in terminal:<br/>
```cmd
PS C:\Users\Admin\Documents\GitHub\jsinsim> node index.js
[host] Connecting to ip:port
[host] Connected.
```
> If you get connection errors, check your host <b>ip</b>, <b>port</b> and <b>admin</b> password, make sure your public ip is whitelisted in host panel

## Library functions
```js
const InSim = require('./module/insim');
```
```js
/* Server */
InSim.Server.message(hostName, text, sound || 0); // send message to all players and play sound (optional)
```
```js
/* Packets */
InSim.Packets.send(hostName, name, data); // send packet to the server
InSim.Packets.on(name, callback: (data)); // register packet listener
```
```js
/* Events */
InSim.Events.fire(name, ...args); // fire event listener named as name
InSim.Events.on(name, callback: (...args)); // register event listener
InSim.Events.off(name); // unregister event listener
```
```js
/* Players */
InSim.Players.all(hostName || false); // return players list of selected host (optional)
InSim.Players.getByUCID(hostName, ucid); // return player by host and UCID
InSim.Players.deleteByUCID(hostName, ucid); // delete player by host and UCID

// player
/*
hostName    : player host name where is currently connected
ucid        : player unique id
uname       : player license name
pname       : player username
admin       : is player authorized as admin
language    : player language
userid      : player license id
ip          : player ip
vehicle     : player current vehicle
*/

player.message(text, sound || 0); // send message to player and play sound (optional)
player.allowVehicles(vehicles); // allow default vehicles for player like UF1, XFG...
```
```js
/* Commands */
InSim.Commands.on(name, callback: (player, args)); // register command listener

// command is specifed when message starts with prefix that's defined in config file.
```
```js
/* Vehicles */
InSim.Vehicles.all(hostName || false); // return vehicles list of selected host (optional)
InSim.Vehicles.getByPLID(hostName, ucid); // return vehicle by host and PLID
InSim.Vehicles.deleteByPLID(hostName, ucid); // delete vehicle by host and PLID (not recommended, use vehicle.delete(); instead)

// vehicle
/*
hostName     : vehicle host name where is created
player       : vehicle owner
plid         : vehicle plid
plate        : vehicle number plate
cname        : vehicle name
sname        : vehicle skin name
hmass        : vehicle mass (kg)
htres        : vehicle intake restriction
config       : vehicle configuration 
fuel         : vehicle fuel percent if /showfuel yes enabled
speed        : vehicle speed (km/h)
pos          : vehicle position
direction    : vehicle direction
heading      : vehicle heading
created      : vehicle creation date (when player joined track)
resets       : vehicle resets (when and where player reseted his vehicle)
*/

vehicle.setPosition(pos, repair || false); // set vehicle position and repair it (optional)
vehicle.delete(); // remove vehicle from track (sets player into spectate mode)
```
```js
/* Buttons */
InSim.Buttons.getByUCIDNameGroup(hostName, ucid, name, group); // get button by host, ucid, name and group
InSim.Buttons.createSimple(player, name, group, width, height, top, left, text, style, inst: (default: false)); 
// create simple button on screen for player
// inst: true, means button will be visible if you are pressed ESC and etc.

InSim.Buttons.createClick(player, name, group, width, height, top, left, text, style, inst: (default: false), callback: (player, click)); 
// create clickable button on screen for player, when player clicks it callback will be executed

InSim.Buttons.createInput(player, name, group, width, height, top, left, text1, text2, style, callback: (player, text), typeIn: (default: 95)); 
// create input button on screen for player, when player inputs text callback will be executed
// text1: text in window when player clicks it
// text2: text before click
// typeIn: max input length
```
```js
/* Objects */
InSim.Objects.all(hostName || false); // return objects list of selected host (optional)
InSim.Objects.add(hostName, object || array of objects); // add objects to host
InSim.Objects.addAsync(hostName, object || array of objects); // add objects to host (async function)
InSim.Objects.remove(hostName, object || array of objects); // remove objects from host
InSim.Objects.removeAsync(hostName, object || array of objects); // remove objects from host (async function)
InSim.Objects.move(hostName, object1, object2); // remove object1, add object2
```
```js
/* Mods */
InSim.Mods.loadFile(filePath); // load mods list from selected file, if file is not found function will create and activate file, added and removed mods will be saved and loaded after restart of host
InSim.Mods.add(modId || array of modIds); // allow to use mod by modId or array of modIds
InSim.Mods.remove(modId || array of modIds); // disallow to use mod by modId or array of modIds
```
