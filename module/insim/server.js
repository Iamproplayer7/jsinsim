const net = require('net');
const fs = require('fs'); 
const ini = require('ini');
const BufferList = require('bufferlist');

const packetsDecoder = require('../decoders/packets.js');
const Packets = require('./classes/packets.js');

class ServerHandler {
    constructor() {
        this.callback = false;
        this.hosts = {};
    }

    start(hosts, callback = false) {
        this.callback = callback;

        for(const hostName of Object.keys(hosts)) {
            this.hosts[hostName] = {
                name: hostName, // host name
                ip: hosts[hostName].ip, // server ip
                port: hosts[hostName].port, // server port
                admin: hosts[hostName].admin, // server admin password
                prefix: hosts[hostName].prefix, // command prefix
                pps: hosts[hostName].pps, // NLP/MCI packets per second

                buffer: new BufferList, // buffer to save incoming packets
                client: false, // net client
                intervals: {},
                connected: false, // connection state
            }

            // init connection
            this.connect(this.hosts[hostName]);
        }
    }

    connect(host) {
        console.log('[' + host.name + '] Connecting to ' + host.ip + ':' + host.port);

        host.client = net.connect(host.port, host.ip);
        host.client.on('connect', () => {
            this.sendPacket(host, 'IS_ISI', { 
                reqi: 1,
                udpport: 0,
                flags: 2043, // all flags for InSim 9
                prefix: host.prefix.charCodeAt(0),
                interval: 1000/host.pps,
                admin: host.admin,
                iname: '9',
                insimver: 9
            });

            this.sendPacket(host, 'IS_MAL_PACK', { mods: ['000000'] }); // allow all mods

            this.sendPacket(host, 'IS_TINY', { reqi: 1, subt: 6 }); // send camera pos
            this.sendPacket(host, 'IS_TINY', { reqi: 1, subt: 7 }); // send state info
            this.sendPacket(host, 'IS_TINY', { reqi: 1, subt: 8 }); // get time in hundredths
            this.sendPacket(host, 'IS_TINY', { reqi: 1, subt: 10 }); // get multiplayer info
            this.sendPacket(host, 'IS_TINY', { reqi: 1, subt: 13 }); // get NCN for all connections
            this.sendPacket(host, 'IS_TINY', { reqi: 1, subt: 14 }); // get all players
            this.sendPacket(host, 'IS_TINY', { reqi: 1, subt: 15 }); // get all results
            this.sendPacket(host, 'IS_TINY', { reqi: 1, subt: 16 }); // send an IS_NLP
            this.sendPacket(host, 'IS_TINY', { reqi: 1, subt: 17 }); // send an IS_MCI
            this.sendPacket(host, 'IS_TINY', { reqi: 1, subt: 18 }); // send an IS_REO
            this.sendPacket(host, 'IS_TINY', { reqi: 1, subt: 19 }); // send an IS_RST
            this.sendPacket(host, 'IS_TINY', { reqi: 1, subt: 20 }); // send an IS_AXI - AutoX Info
            this.sendPacket(host, 'IS_TINY', { reqi: 1, subt: 22 }); // send an IS_RIP - Replay Information Packet
            this.sendPacket(host, 'IS_TINY', { reqi: 1, subt: 23 }); // get NCI for all guests
            this.sendPacket(host, 'IS_TINY', { reqi: 1, subt: 25 }); // send IS_AXM packets for the entire layout
            
            // this packet will maintain the connection
            host.intervals.IS_TINY = setInterval(() => {
                this.sendPacket(host, 'IS_TINY', { reqi: 1, subt: 0 });
            }, 1000);
        });

        host.client.on('data', (data) => {
            host.buffer.push(data);

            var size = this.peekByte(host);
            while ((host.buffer.length > 0) && (size <= host.buffer.length)){
                if(size > 0) {
                    this.decodePacket(host, host.buffer.take(size));
                    host.buffer.advance(size); 
                }

                // next packet size
                size = this.peekByte(host);
            }
        });

        host.client.on('close', () => {
            console.log('[' + host.name + '] Disconnected.');
            this.disconnect(host);
        });

        host.client.on('error', (err) => {
            console.log('[' + host.name + '] Error: ' + err.code);
            this.disconnect(host);
        });
    }

    disconnect(host) {
        for(const interval of Object.keys(host.intervals)) {
            clearInterval(interval);
            delete host.intervals[interval];
        }

        // end client
        if(host.client) {
            host.client.end();
            host.client = false;
        }
    }

    // this function for decoding packets
    peekByte(host, offset) {
		offset = offset || 0;
		return offset >= host.buffer.length ? 0 : host.buffer.take(1).readUInt8(offset)*4;
    }

    sendPacket(host, name, data) {
        if(!host.client) return;

        const packetEncoded = packetsDecoder.getPacketBuffered(name, data);
        if(packetEncoded) {
            host.client.write(packetEncoded);
        }
    }

    decodePacket(host, data) {
        if(!host.client) return;

        const packetId = data.readUInt8(1);
        const packetName = packetsDecoder.getById(packetId);
        if(!packetName) {
            return console.log('[packet] not decoded! (ID: ' + packetId + ')');
        }

        // if host response it means host is connected
        if(!host.connected) {
            host.connected = true;
            console.log('[' + host.name + '] Connected.');

            if(this.callback) {
                this.callback(host.name);
                this.callback = false;
            }
        }

        // decode packet
        var packetDecoded = packetsDecoder.getPacketBuffered(packetName, data);
        if(packetDecoded) {
            packetDecoded = { hostName: host.name, ...packetDecoded };

            // remove nulltermdstr
            for(const key of Object.keys(packetDecoded)) {
                const value = packetDecoded[key];
                if(typeof value == 'string' && value.length > 0) {
                    const indexOfNull = value.indexOf('\0');
                    if(indexOfNull !== -1) {
                        packetDecoded[key] = value.substr(0, indexOfNull);
                    }
                }
            }

            // fire packet handler
            Packets.fire(packetName, packetDecoded);

            //console.log(packetName)
        }
    }

    /* functions */
    getHostByName(hostName) {
        const host = this.hosts[hostName];
        return host === undefined ? false : host;
    }
    
    message(hostName, text, sound = 0) {
        Packets.send(hostName, 'IS_MTC', { ucid: 255, text: text, sound: sound });
    }
}

module.exports = new ServerHandler();