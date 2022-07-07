## Packets
You can use packets through this class: `InSim.Packets`. 
```js
// listen
InSim.Packets.on(packetName, (data) => {
    console.log('packet data:', data);
});

// send packet
InSim.Packets.send(hostName, name, data);
// hostName: send to host
// name: packet name
// data: data in object
```
## Example
```js
// listen
InSim.Packets.on('IS_VER', (data) => {
    console.log(data);
    /*
    {
      hostName: 'host',
      size: 5,
      type: 2,
      reqi: 1,
      zero: 0,
      version: '0.7D',
      product: 'S3',
      insimver: 9,
      spare: 0
    }
    */
    
    // send message to host chat
    InSim.Packets.send(data.hostName, 'IS_MTC', { ucid: 255, text: 'hello this is example' });
});
```


## Packets List
Check this [file](https://github.com/Iamproplayer7/jsinsim/blob/main/module/decoders/packets.js) for names or what data should be sent or received!