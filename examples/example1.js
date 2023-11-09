// this example is for starting InSim module and connecting to your host.

const InSim = require('../module/insim');

const Server = new InSim.Server('hostName', '188.122.74.155', 52634, 'test', '!', 12);
Server.onConnect(() => {
    Server.message('^2InSim: Node.js connected.');
});