## Commands
You can listen to commands through this class: `InSim.Commands`. 
```js
// listen
InSim.Commands.on('test', (player, args) => {
    console.log('player: ' + player.uname + ' called command: test with args:', args);
    // player: iamproplayer7 called command: test with args: []
});

// write !test in the chat
```