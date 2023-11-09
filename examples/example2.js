// this example is for starting InSim module and connecting to multiple hosts.
// this example shows how you can use multiple hosts in one code

// this how it looks ingame
// https://i.imgur.com/tjX65cX.png

const InSim = require('../module/insim');

// connect to two hosts
const Server1 = new InSim.Server('hostName1', '188.122.74.155', 52634, 'test', '!', 12);
Server1.onConnect(() => {
    const Server2 = new InSim.Server('hostName2', '188.122.74.155', 52634, 'test', '!', 12);
    Server2.onConnect(() => {
        // send message to chat when both hosts are connected
        Server1.message('^2InSim: Node.js connected.');
        Server2.message('^2InSim: Node.js connected.');
    });
});

// log when player connects to server
InSim.Event.on('Player:connect', (player) => {
    console.log(player.uname + ' connected. (' + player.server.name + ')');
});

// log when player disconnects from server
InSim.Event.on('Player:disconnect', (player) => {
    console.log(player.uname + ' disconnected. (' + player.server.name + ')');
});

// interval to show every server online count on each server using InSim.Button
setInterval(() => {
    const online = {};
    // loop every server
    for(const server of InSim.Server.all) {
        online[server.name] = InSim.Player.all.filter((player) => player.server === server).length;
    }

    // loop every player
    for(const player of InSim.Player.all) {
        // send button
        InSim.Button.simple(player, 'TITLE', 'ONLINE', 20, 7, 70, 90, '^2ONLINE', 32);
                
        var top = 70+7;
        for(const key of Object.keys(online)) {
            const value = online[key];
            
            // send button
            InSim.Button.simple(player, key, 'MAIN', 20, 5, top, 90, '^7' + key + ': ^2' + value, 32);
            top += 5;
        }
    }
}, 1000);