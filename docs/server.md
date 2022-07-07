## Server
You can use this class: `InSim.Server`. 
```js
InSim.Server.each(callback: (host)); // call callback on each host
InSim.Server.message(hostName | false, text, sound | 0); // send message to specified host | to all hosts.
InSim.Server.command(hostName | false, command); // send command to specified host | to all hosts.
```

## Example
```js
// get hosts names and send message
InSim.Server.each((host) => {
    InSim.Server.message(host.name, 'this is example!');
});

// or you can do this
InSim.Server.message(false, 'this is example!');
```