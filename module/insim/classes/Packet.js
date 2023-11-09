class Packet {
    static all = [];

    on(name, callback) {
        if(Array.isArray(name)) {
            for(const key of name) {
                Packet.all.push({ name: key, callback });
            }
        }
        else {
            Packet.all.push({ name, callback });
        }
    }

    fire(name, ...args) {
        const packets = Packet.all.filter((packet) => packet.name === name);
        for(const packet of packets) {
            packet.callback(...args);
        }
    }

    send(server, name, data) {
        server.sendPacket(name, data);
    }
}

module.exports = new Packet;