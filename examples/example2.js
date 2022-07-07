// this example is for starting InSim module and connecting to multiple hosts.
// this example shows how you can use multiple hosts in one code

// this how it looks ingame
// https://i.imgur.com/tjX65cX.png

const InSim = require('../module/insim');

// connect to two hosts
InSim.Server.start({
    host1: {
        ip: '188.122.74.155',
        port: 53330,
        admin: 'testas',
        prefix: '!',
        pps: 12
    },
    host2: {
        ip: '188.122.74.155',
        port: 51610,
        admin: 'testas',
        prefix: '!',
        pps: 12
    }
}, (hostName) => {
    // send message to chat when host is connected
    InSim.Server.message(hostName, '^2InSim: Node.js connected.');
});

// log when player connects to server
InSim.Events.on('Player:connect', (player) => {
    console.log(player.uname + ' connected. (' + player.hostName + ')');
});

// log when player disconnects from server
InSim.Events.on('Player:disconnect', (player) => {
    console.log(player.uname + ' disconnected. (' + player.hostName + ')');
});

// interval to show every host online count on each host using InSim.Buttons
setInterval(() => {
    const online = {};
    // foreach every host
    InSim.Server.each(host => {
        online[host.name] = InSim.Players.all(host.name).length;
    });

    // foreach every player
    InSim.Players.each((player) => {
        // send button
        InSim.Buttons.createSimple(player, 'TITLE', 'ONLINE', 20, 7, 70, 90, '^2ONLINE', 32);
                
        var top = 70+7;
        for(const hostName of Object.keys(online)) {
            const count = online[hostName];
            
            // send button
            InSim.Buttons.createSimple(player, hostName, 'MAIN', 20, 5, top, 90, '^7' + hostName + ': ^2' + count, 32);
            top += 5;
        }
    });
}, 1000);