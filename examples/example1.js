// this example is for starting InSim module and connecting to your host.

const InSim = require('../module/insim');

InSim.Server.start({
    host: {
        ip: '188.122.74.155',
        port: 53330,
        admin: 'testas',
        prefix: '!',
        pps: 12
    }
}, (hostName) => {
    InSim.Server.message(hostName, '^2InSim: Node.js connected.');
});
