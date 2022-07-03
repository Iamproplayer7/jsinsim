const net = require('net');
const fs = require('fs'); 
const ini = require('ini');
const BufferList = require('bufferlist');

const packets = require('./decoders/packets.js');

class ServerHandler {
    constructor() {
        this.hosts = {};
    }

    start() {
        // create config.ini if not exists.
        if(!fs.existsSync('./config.ini')) {
            console.log('[config]: creating config.ini..');
            fs.writeFileSync('./config.ini', ini.stringify({ 
                ip: 'ip',
                port: 'port',
                admin: 'admin',
                prefix: '!',
                pps: 12
            }, { section: 'host name' }))
        }
        
        // load config.ini file
        const config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));
        if(Object.keys(config).length < 1) {
            console.log('[config]: configuration is wrong. config.ini should look like:\n\n[host name]\nip=server ip\nport=server port\nadmin=server admin password\nprefix=command prefix\npps=NLP/MCI packets per second (0-12)\n');
            return process.exit();
        }

        for(const hostName of Object.keys(config)) {
            if(config[hostName].ip === undefined || config[hostName].port === undefined || config[hostName].admin === undefined) { 
                console.log('[config]: configuration is wrong. config.ini should look like:\n\n[host name]\nip=server ip\nport=server port\nadmin=server admin password\nprefix=command prefix\npps=NLP/MCI packets per second (0-12)\n');
                return process.exit();
            }

            this.hosts[hostName] = {
                name: hostName, // host name
                ip: config[hostName].ip, // server ip
                port: config[hostName].port, // server port
                admin: config[hostName].admin, // server admin password
                prefix: config[hostName].prefix, // command prefix
                pps: config[hostName].pps, // NLP/MCI packets per second

                buffer: new BufferList, // buffer to save incoming packets
                stream: false, // net stream
                intervals: {},
                connected: false, // connection state
            }

            // init connection
            this.connect(this.hosts[hostName]);
        }
    }

    connect(host) {
        console.log('[' + host.name + '] Connecting to ' + host.ip + ':' + host.port);

        host.stream = net.connect(host.port, host.ip);
        host.stream.on('connect', () => {
            this.sendPacket(host, 'IS_ISI', { 
                reqi: 1,
                udpport: 0,
                flags: 2043, // all flags for InSim 9
                prefix: host.prefix.charCodeAt(0),
                interval: 1000/host.pps,
                admin: host.admin,
                iname: 'InSim Version: 9',
                insimver: 9
            });

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

        host.stream.on('data', (data) => {
            host.buffer.push(data);

            var size = this.peekByte(host);
            while ((host.buffer.length > 0) && (size <= host.buffer.length)){
                if(size > 0) {
                    const p = host.buffer.take(size);
                    this.decodePacket(host, p);
                    host.buffer.advance(size); 
                }

                // next packet size
                size = this.peekByte(host);
            }
        });

        host.stream.on('close', () => {
            console.log('[' + host.name + '] Disconnected.');
            this.disconnect(host);
        });

        host.stream.on('error', (err) => {
            console.log('[' + host.name + '] Error: ' + err.code);
            this.disconnect(host);
        });
    }

    disconnect(host) {
        for(const interval of Object.keys(host.intervals)) {
            clearInterval(interval);
            delete host.intervals[interval];
        }

        // end stream
        if(host.stream) {
            host.stream.end();
            host.stream = false;
        }
    }

    // this function for decoding packets
    peekByte(host, offset) {
		offset = offset || 0;
		return offset >= host.buffer.length ? 0 : host.buffer.take(1).readUInt8(offset)*4;
	}

    sendPacket(host, name, data) {
        if(!host.stream) return;

        const packetEncoded = packets.getPacketBuffered(name, data);
        if(packetEncoded) {
            host.stream.write(packetEncoded);
        }
    }

    decodePacket(host, data) {
        if(!host.stream) return;

        const packetId = data.readUInt8(1);
        const packetName = packets.getById(packetId);
        if(!packetName) {
            return console.log('[packet] not decoded! (ID: ' + packetId + ')');
        }

        // if host response it means it's connected
        if(!host.connected) {
            host.connected = true;
            console.log('[' + host.name + '] connected.')
        }

        // decode packet
        var packetDecoded = packets.getPacketBuffered(packetName, data);
        if(packetDecoded) {
            packetDecoded = { hostName: host.name, ...packetDecoded };

            // remove nulltermdstr
            for(const p of Object.keys(packetDecoded)) {
                if(typeof packetDecoded[p] == 'string' && packetDecoded[p].length > 0) {
                    if(packetDecoded[p].indexOf('\0') > 0) {
                        packetDecoded[p] = packetDecoded[p].substr(0, packetDecoded[p].indexOf('\0'));
                    }
                }
            }
        }
    }
}
const Server = new ServerHandler;

module.exports = Server;