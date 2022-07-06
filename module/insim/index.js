// load InSim.Server
const Server = require('./server.js'); 

// load all classes.
const Packets = require('./classes/packets.js');
Packets.Server = Server; 
// this required because we can't import Packets into Server and Server into Packets
// i'm setting variable for it to avoid this error.

const Events = require('./classes/events.js');
const Players = require('./classes/players.js');
const Vehicles = require('./classes/vehicles.js');
const Commands = require('./classes/commands.js');
const Buttons = require('./classes/buttons.js');
const Mods = require('./classes/mods.js');
const Objects = require('./classes/objects.js');

module.exports = { Server, Packets, Events, Players, Vehicles, Commands, Buttons, Mods, Objects };