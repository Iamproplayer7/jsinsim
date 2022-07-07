const Packets = require('./packets.js');
const Events = require('./events.js');

const DEFAULT_VEHICLES = { XFG: 1, XRG: 2, XRT: 4, RB4: 8, FXO: 0x10, LX4: 0x20, LX6: 0x40, MRT: 0x80, UF1: 0x100, RAC: 0x200, FZ5: 0x400, FOX: 0x800, XFR: 0x1000, UFR: 0x2000, FO8: 0x4000, FXR: 0x8000, XRR: 0x10000, FZR: 0x20000, BF1: 0x40000, FBM: 0x80000 };

class PlayerHandler {
    constructor(data) {
        this.hostName = data.hostName;
        this.ucid = data.ucid;
        this.uname = data.uname;
        this.pname = data.pname;
        this.admin = !!data.admin;
        this.language = 0;
        this.userid = 0;
        this.ip = false;

        this.vehicle = false;
    }

    message(text, sound = 0) {
        Packets.send(this.hostName, 'IS_MTC', { ucid: 255, text: text, sound: sound });
    }

    kick() {
        Packets.send(this.hostName, 'IS_MST', { text: '/kick ' + this.uname });  
    }

    ban(hours = 0) {
        // 0 = 12h
        Packets.send(this.hostName, 'IS_MST', { text: '/ban ' + this.uname + ' ' + hours });  
    }

    allowVehicles(vehicles) {
        var c = 0;
        for(const vehicle of vehicles) {
            if(DEFAULT_VEHICLES[vehicle] !== undefined) {
                c += DEFAULT_VEHICLES[vehicle];
            }
        }

        Packets.send(this.hostName, 'IS_PLC', { ucid: this.ucid, cars: c });
    }
}

class PlayersHandler {
    constructor() {
        this.players = [];

        // handle IS_NCN & IS_NCI & IS_CNL & IS_VTN packets
        // IS_NCN: player connect
        // IS_NCI: player connect info
        // IS_CNL: player disconnect
        // IS_VTN: player vote
        // IS_PEN: player penalty
        // IS_TOC: player take over car

        Packets.on('IS_NCN', (data) => {
            if(data.ucid === 0) return;

            const player = new PlayerHandler(data);
            this.players.push(player);

            // event
            Events.fire('Player:connect', player);
        });

        Packets.on('IS_NCI', (data) => {
            const player = this.getByUCID(data.hostName, data.ucid);
            if(player) {
                player.language = data.language;
                player.userid = data.userid;
                player.ip = data.ipaddress;
            }
        });

        Packets.on('IS_CNL', (data) => {
            const player = this.getByUCID(data.hostName, data.ucid);
            const deleted = this.deleteByUCID(data.hostName, data.ucid);
            if(deleted) {
                // event
                Events.fire('Player:disconnect', player);
            }
        });

        Packets.on('IS_VTN', (data) => {
            const player = this.getByUCID(data.hostName, data.ucid);
            if(player) {
                // event
                Events.fire('Player:vote', player, data.action);
            }
        });

        Packets.on('IS_PEN', (data) => {
            const player = this.getByUCID(data.hostName, data.ucid);
            if(player) {
                // event
                Events.fire('Player:penalty', player, { oldpen: data.oldpen, newpen: data.newpen, reason: data.reason });
            }
        });

        Packets.on('IS_TOC', (data) => {
            const player1 = this.getByUCID(data.hostName, data.olducid);
            const player2 = this.getByUCID(data.hostName, data.newucid);
            if(player1 && player2) {
                // event
                Events.fire('Player:takeOve', player1, player2);
            }
        });
    }

    all(hostName = false) {
        if(hostName) {
            return this.players.filter(player => player.hostName === hostName);
        }
        else {
            return this.players;
        }
    }

    each(callback) {
        for(const player of this.players) {
            callback(player);
        }
    }

    getByUCID(hostName, ucid) {
        var exists = false;
        for(const player of this.players) {
            if(player.hostName == hostName && player.ucid == ucid) {
                exists = player;
            }
        }

        return exists;
    }

    getByKey(hostName, key, value) {
        var exists = false;
        for(const player of this.players) {
            if(player.hostName === hostName && player[key] === value) {
                exists = player;
            }
        }

        return exists;
    }

    getByUName(hostName, uname) {
        var exists = false;
        for(const player of this.players) {
            if(player.hostName === hostName && player.uname.toLowerCase() === uname.toLowerCase()) {
                exists = player;
            }
        }

        return exists;
    }

    deleteByUCID(hostName, ucid) {
        var deleted = false;
        for(const player of this.players) {
            if(player.hostName == hostName && player.ucid == ucid) {
                const indexOf = this.players.indexOf(player);
                if(indexOf !== -1) {
                    this.players.splice(indexOf, 1);
                    deleted = true;
                }
            }
        }

        return deleted;
    }
}

module.exports = new PlayersHandler;