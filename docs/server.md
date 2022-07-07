## Server
You can use functions through this class: `InSim.Server`. 
```js
// forEach host
InSim.Server.each(callback: (host));

// send message
InSim.Server.message(hostName | false, text, sound | 0);

// send command
InSim.Server.command(hostName | false, command);
```

## Example
```js
// get hosts names and send message
InSim.Server.each((host) => {
    InSim.Server.message(host.name, 'this is example!');
});

// or you can do this (this will send message to all hosts)
InSim.Server.message(false, 'this is example!');
```