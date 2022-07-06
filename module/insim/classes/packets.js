const Server = require('../server.js');

class PacketsHandler {
    constructor() {
        this.packets = [];
        this.Server = false;
    }

    on(name, callback) {
        if(Array.isArray(name)) {
            for(const name_ of name) {
                this.packets.push({ name: name_, callback: callback });
            }
        }
        else {
            this.packets.push({ name: name, callback: callback });
        }
    }

    fire(name, ...args) {
        for(const packet of this.packets) {
            if(packet.name === name) {
                packet.callback(...args);
            }
        }
    }

    send(hostName, name, data) {
        const host = this.Server.hosts[hostName]; if(host === undefined) return;
        this.Server.sendPacket(host, name, data);
    }
}

module.exports = new PacketsHandler;