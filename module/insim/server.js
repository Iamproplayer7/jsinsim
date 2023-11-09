const net = require('net');
const BufferList = require('bufferlist');

const Decoder = require('../decoders/packets.js');
const Packet = require('./classes/Packet.js');

class Public {
    static all = [];
    static getByName = (name) => {
        return Public.find((server) => server.name === name);
    }

    static message = (server = false, text, sound = 0) =>  {
        if(server) {
            return server.message(text, sound);
        }

        for(const server of Public.all) {
            server.message(text, sound);
        }
    }

    static command = (server = false, text) =>  {
        if(server) {
            return server.command(text);
        }

        for(const server of Public.all) {
            server.command(text);
        }
    }

    constructor(...args) {
        const Server_ = new Server(...args);
        Public.all.push(Server_);

        return Server_;
    }
}

class Server {
    constructor(name, ip, port, admin, prefix = '!', pps = 12) {
        this.name = name;
        this.ip = ip;
        this.port = port;
        this.admin = admin;
        this.prefix = prefix;
        this.pps = pps;

        // server connection
        this.callback = false;
        this.buffer = new BufferList;
        this.client = false;
        this.intervals = {};
        this.connected = false;

        this.connect();
    }

    onConnect(callback) {
        this.callback = callback;
    }

    connect() {
        console.log('[' + this.name + '] Connecting to ' + this.ip + ':' + this.port);

        this.client = net.connect(this.port, this.ip);
        this.client.on('connect', () => {
            this.sendPacket('IS_ISI', { 
                reqi: 1,
                udpport: 0,
                flags: 2043+2048, // all flags for InSim 9
                prefix: this.prefix.charCodeAt(0),
                interval: 1000/this.pps,
                admin: this.admin,
                iname: this.name,
                insimver: 9
            });

            this.sendPacket('IS_MAL_PACK', { mods: ['000000'] }); // allow all mods

            this.sendPacket('IS_TINY', { reqi: 1, subt: 6 }); // send camera pos
            this.sendPacket('IS_TINY', { reqi: 1, subt: 7 }); // send state info
            this.sendPacket('IS_TINY', { reqi: 1, subt: 8 }); // get time in hundredths
            this.sendPacket('IS_TINY', { reqi: 1, subt: 10 }); // get multiplayer info
            this.sendPacket('IS_TINY', { reqi: 1, subt: 13 }); // get NCN for all connections
            this.sendPacket('IS_TINY', { reqi: 1, subt: 14 }); // get all players
            this.sendPacket('IS_TINY', { reqi: 1, subt: 15 }); // get all results
            this.sendPacket('IS_TINY', { reqi: 1, subt: 16 }); // send an IS_NLP
            this.sendPacket('IS_TINY', { reqi: 1, subt: 17 }); // send an IS_MCI
            this.sendPacket('IS_TINY', { reqi: 1, subt: 18 }); // send an IS_REO
            this.sendPacket('IS_TINY', { reqi: 1, subt: 19 }); // send an IS_RST
            this.sendPacket('IS_TINY', { reqi: 1, subt: 20 }); // send an IS_AXI - AutoX Info
            this.sendPacket('IS_TINY', { reqi: 1, subt: 22 }); // send an IS_RIP - Replay Information Packet
            this.sendPacket('IS_TINY', { reqi: 1, subt: 23 }); // get NCI for all guests
            this.sendPacket('IS_TINY', { reqi: 1, subt: 25 }); // send IS_AXM packets for the entire layout
            
            // this packet will maintain the connection
            this.intervals.IS_TINY = setInterval(() => {
                this.sendPacket('IS_TINY', { reqi: 1, subt: 0 });
            }, 1000);
        });

        this.client.on('data', (data) => {
            this.buffer.push(data);

            var size = this.peekByte();
            while ((this.buffer.length > 0) && (size <= this.buffer.length)){
                if(size > 0) {
                    this.decodePacket(this.buffer.take(size));
                    this.buffer.advance(size); 
                }

                // next packet size
                size = this.peekByte();
            }
        });

        this.client.on('close', () => {
            console.log('[' + this.name + '] Disconnected.');
            this.disconnect();
        });

        this.client.on('error', (err) => {
            console.log('[' + this.name + '] Error: ' + err.code);
            this.disconnect();
        });
    }

    disconnect() {
        for(const key of Object.keys(this.intervals)) {
            this.clearInterval(key);
        }

        // end client
        if(this.client) {
            this.client.end();
            this.client = false;
        }
    }

    peekByte(offset) {
		offset = offset || 0;
		return offset >= this.buffer.length ? 0 : this.buffer.take(1).readUInt8(offset)*4;
    }

    sendPacket(name, data) {
        if(!this.client) return;

        const encoded = Decoder.getPacketBuffered(name, data);
        if(encoded) {
            this.client.write(encoded);
        }
    }

    decodePacket(data) {
        if(!this.client) return;

        const packetId = data.readUInt8(1);
        const packetName = Decoder.getById(packetId);
        if(!packetName) {
            return console.log('[Packet] Failed to decode! (ID: ' + packetId + ')');
        }

        // if host responses it means host is already connected
        if(!this.connected) {
            this.connected = true;
            console.log('[' + this.name + '] Connected.');

            if(this.callback) {
                this.callback();
            }
        }

        // decode packet
        var decoded = Decoder.getPacketBuffered(packetName, data);
        if(decoded) {
            decoded = { server: this, ...decoded };

            // remove nulltermdstr
            for(const key of Object.keys(decoded)) {
                const value = decoded[key];
                if(typeof value == 'string' && value.length > 0) {
                    const indexOf = value.indexOf('\0');
                    if(indexOf !== -1) {
                        decoded[key] = value.slice(0, indexOf);
                    }
                }
            }
            
            Packet.fire(packetName, decoded);
        }
    }

    // intervals
    setInterval(name, callback, ms) {
        if(this.intervals[name]) {
            return console.log('[Interval] Failed to create! (Interval ' + name + ' already exists)');
        }

        this.intervals[name] = setInterval(callback, ms);
    }

    clearInterval(name) {
        const interval = this.intervals[name];
        if(interval) {
            clearInterval(interval);
            delete this.intervals[name];
        }
    }

    message(text, sound = 0) {
        Packet.send(this, 'IS_MTC', { ucid: 255, text, sound });
    }
    
    command(text) {
        Packet.send(this, 'IS_MST', { text });
    }
}

module.exports = Public;