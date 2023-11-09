// this example shows how you can use commands

const InSim = require('../module/insim');

const Server = new InSim.Server('hostName', '188.122.74.155', 52634, 'test', '!', 12);
Server.onConnect(() => {
    Server.message('^2InSim: Node.js connected.');
});

// listen to command !getIP
InSim.Command.on('getIP', (player) => {
    // send message to player
    player.message('^2Your IP address is: ^3' + player.ip);
});

// listen to command !shutdown
InSim.Command.on('shutdown', (player, time) => {
    time = time !== undefined ? parseInt(time) : -1;

    if(!player.adminLFS) {
        return player.message('^1You do not have access to this command!');
    }
    else if(time < 0) {
        return player.message('^1Command usage: !shutdown [time in seconds]');
    }
    else {
        // send message to every player
        player.server.message('^1Insim Connection will be closed in ' + time + ' seconds!');
        // or
        InSim.Server.message(player.server, '^1Insim Connection will be closed in ' + time + ' seconds!')

        // execute code after time
        setTimeout(() => {
            // send message to every player
            InSim.Server.message(player.server, '^1InSim says: bye bye');

            setTimeout(() => {
                // stop script
                process.exit();
            }, 100);
        }, time * 1000); // seconds to miliseconds
    }
});