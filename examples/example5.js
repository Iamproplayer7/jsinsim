// this example shows how you can use commands and mods together

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

// init mods file
InSim.Mods.loadFile('./mods.cfg');

/* EXAMPLE */
// listen to command !mods
InSim.Commands.on('mods', (player, args) => {
    if(!player.admin) {
        return player.message('^1You do not have access to this command!');
    }
    // check if !mods list | !mods add | !mods remove
    else if(args[0] === undefined || (args[0] !== "list" && args[0] !== "add" && args[0] !== "remove")) {
        return player.message('^1Command usage: !mods [list/add/remove]');
    }
    else {
        const type = args[0];

        if(type == "list") {
            // send mods list
            player.message('^2Mods list (' + InSim.Mods.all().length + '):');
            for(const modId of InSim.Mods.all()) {
                player.message('^2ModId: ' + modId);
            }
        }
        else if(type == "add") {
            const id = args[1];

            if(id === undefined || id.length !== 6) {
                return player.message('^1Command usage: !mods add 000000');
            }
            else {
                // add mod
                InSim.Mods.add(id);
                player.message('^2Mod ' + id + ' added!');
            }
        }
        else if(type == "remove") {
            if(id === undefined || id.length !== 6) {
                return player.message('^1Command usage: !mods remove 000000');
            }
            else {
                // remove mod
                InSim.Mods.remove(id);
                player.message('^2Mod ' + id + ' removed!');
            }
        }
    }
});