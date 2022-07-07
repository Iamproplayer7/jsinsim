// this example shows how you can use commands

const InSim = require('../module/insim');

InSim.Server.start({
    host1: {
        ip: '188.122.74.155',
        port: 53330,
        admin: 'testas',
        prefix: '!',
        pps: 12
    }
}, (hostName) => {
    InSim.Server.message(hostName, '^2InSim: Node.js connected.');
});

/* EXAMPLE */
// listen to command !getIP
InSim.Commands.on('getIP', (player, args) => {
    // send message to player
    player.message('^2Your IP address is: ^3' + player.ip);
});

// listen to command !shutdown
InSim.Commands.on('shutdown', (player, args) => {
    if(!player.admin) {
        return player.message('^1You do not have access to this command!');
    }
    else if(args[0] === undefined || parseInt(args[0]) < 0) {
        return player.message('^1Command usage: !shutdown [time in seconds]');
    }
    else {
        // string to int
        const time = parseInt(args[0]);

        // send message to every player
        InSim.Server.message(false, '^1Insim Connection will be closed in ' + time + ' seconds!');
        
        // execute code after time
        setTimeout(() => {
            // send message to every player
            InSim.Server.message(false, '^1InSim says: bye bye');

            // stop script
            process.exit();
        }, time * 1000); // seconds to miliseconds
    }
});