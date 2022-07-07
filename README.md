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
[InSim.Server](https://github.com/Iamproplayer7/jsinsim/blob/main/docs/server.md)<br/>
[InSim.Events](https://github.com/Iamproplayer7/jsinsim/blob/main/docs/events.md)<br/>
[InSim.Packets](https://github.com/Iamproplayer7/jsinsim/blob/main/docs/packets.md)<br/>
[InSim.Commands](https://github.com/Iamproplayer7/jsinsim/blob/main/docs/commands.md)<br/>
[InSim.Players](https://github.com/Iamproplayer7/jsinsim/blob/main/docs/players.md)<br/>
[InSim.Vehicles](https://github.com/Iamproplayer7/jsinsim/blob/main/docs/vehicles.md)<br/>
[InSim.Buttons](https://github.com/Iamproplayer7/jsinsim/blob/main/docs/buttons.md)<br/>
[InSim.Objects](https://github.com/Iamproplayer7/jsinsim/blob/main/docs/objects.md)<br/>
[InSim.Mods](https://github.com/Iamproplayer7/jsinsim/blob/main/docs/mods.md)

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
        admin: 'admin password', // your host admin password
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