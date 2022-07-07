// this example shows how you can use commands and objects together

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
// listen to command !mods
InSim.Commands.on('object', (player, args) => {
    if(!player.vehicle) {
        return player.message('^1You need to be in a vehicle!');
    }
    else {
        // add object under vehicle
        InSim.Objects.add(player.hostName, { x: player.vehicle.pos.x*16, y: player.vehicle.pos.y*16, z: player.vehicle.pos.z*4, flags: 0, index: 144, heading: 0 });
    }
});

