const Packet = require('./Packet.js');
const Event = require('./Event.js');

function parseHrtimeToSeconds(hrtime) {
    return parseFloat((hrtime[0] + (hrtime[1] / 1e9)));
}

class Public {
    static all = [];

    static getByUCID = (server, ucid) => {
        return Public.all.find((player) => server == player.server && player.ucid == ucid);
    }

    static getByKey(server, key, value) {
        return Public.all.find((player) => server === player.server && player[key] === value);
    }

    static getByUName(server, uname) {
        return Public.all.find((player) => (!server || server === player.server) && player.uname.toLowerCase() === uname.toLowerCase());
    }

    static deleteByUCID(server, ucid) {
        var deleted = false;

        const player = Public.getByUCID(server, ucid);
        if(player) {
            // remove intervals
            for(const key of Object.keys(player.intervals)) {
                clearInterval(player.intervals[key]);
                delete player.intervals[key];
            }

            deleted = true;
            player.valid = false;
            Public.all = Public.all.filter((player_) => player_ !== player);
        }
        

        return deleted;
    }
}

class Player {
    constructor(server, ucid, uname, pname, admin = false) {
        this.valid = true;
        this.server = server;
        this.ucid = ucid;
        this.uname = uname;
        this.pname = pname;
        this.adminLFS = admin;

        // connection info
        this.userid = 0;
        this.language = 0;
        this.ip = '';

        // intervals
        this.intervals = [];

        // vehicle
        this.vehicle = null;

        Public.all.push(this);
    }

    message(text, sound = 0) {
        Packet.send(this.server, 'IS_MTC', { ucid: this.ucid, text, sound });
    }

    kick(text = false) {
        if(!text) {
            return Packet.send(this.server, 'IS_MST', { text: '/kick ' + this.uname });  
        }
        
        Packet.send(this.server, 'IS_MTC', { ucid: this.ucid, text });
        setTimeout(() => {
            if(!this.valid) return;
            Packet.send(this.server, 'IS_MST', { text: '/kick ' + this.uname });  
        }, 100);    
    }

    // 0 = 12 hours
    ban(hours = 0) {
        Packet.send(this.server, 'IS_MST', { text: '/ban ' + this.uname + ' ' + hours });  
    }

    setVehicles(vehicles) {
        const DEFAULT_VEHICLES = { XFG: 1, XRG: 2, XRT: 4, RB4: 8, FXO: 0x10, LX4: 0x20, LX6: 0x40, MRT: 0x80, UF1: 0x100, RAC: 0x200, FZ5: 0x400, FOX: 0x800, XFR: 0x1000, UFR: 0x2000, FO8: 0x4000, FXR: 0x8000, XRR: 0x10000, FZR: 0x20000, BF1: 0x40000, FBM: 0x80000 };

        var c = 0;
        for(const vehicle of vehicles) {
            if(DEFAULT_VEHICLES[vehicle] !== undefined) {
                c += DEFAULT_VEHICLES[vehicle];
            }
        }

        Packet.send(this.server, 'IS_PLC', { ucid: this.ucid, cars: c });
    }

    // intervals
    setInterval(name, callback, ms) {
        const interval = this.intervals.find(interval => interval.name === name);
        if(interval) {
            return console.log('[Player Interval] Failed to create! (Interval ' + interval.name + ' already exists)');
        }

        this.intervals.push({ name, id: setInterval(() => {
            if(!this.valid) return this.clearInterval(name);
            
            const startTime = process.hrtime();
            callback();
            const endTime = process.hrtime(startTime);
            
            const int = this.intervals.find((interval) => name === interval.name);
            if(int) {
                const catched = parseHrtimeToSeconds(endTime);

                int.performance.any = true;

                // last
                int.performance.last = catched;

                // avg
                int.performance.avg.time += catched;
                int.performance.avg.times++;

                // max
                if(catched > int.performance.max) {
                    int.performance.max = catched;
                }

                // min
                if(catched < int.performance.min || int.performance.min === 0) {
                    int.performance.min = catched;
                }
            }
        }, ms), performance: {
            any: false,
            ms: ms,
            last: 0, 
            avg: { times: 0, time: 0 },
            min: 0, max: 0,
        } });
    }

    clearInterval(name) {
        const interval = this.intervals.find(interval_ => interval_ !== undefined && interval_.name === name);
        if(interval) {
            clearInterval(interval.id);
            this.intervals = this.intervals.filter((interval_) => interval_ !== interval);
        }
    }
}

// HANDLE PACKETS
    // IS_NCN: player connect
    // IS_NCI: player connect info
    // IS_CPR: player info update
    // IS_CNL: player disconnect
    // IS_VTN: player vote
    // IS_PEN: player penalty
    // IS_TOC: player take over car
    // IS_CIM: player interface update

Packet.on('IS_NCN', (data) => {
    if(data.ucid === 0) return;

    // event
    Event.fire('Player:connecting', new Player(data.server, data.ucid, data.uname, data.pname, data.admin));
});

Packet.on('IS_NCI', (data) => {
    const player = Public.getByUCID(data.server, data.ucid);
    if(player) {
        player.userid = data.userid;
        player.language = data.language;
        player.ip = data.ipaddress;

        // event
        Event.fire('Player:connect', player);
    }    
});

Packet.on('IS_CPR', (data) => {
    const player = Public.getByUCID(data.server, data.ucid);
    if(player) {
        if(player.pname !== data.pname) {
            // event
            Event.fire('Player:pnameUpdate', player, { old: player.pname, new: data.pname });
            player.pname = data.pname;
        }
    }
});

Packet.on('IS_CNL', (data) => {
    const player = Public.getByUCID(data.server, data.ucid);
    const deleted = Public.deleteByUCID(data.server, data.ucid);

    if(deleted) {
        // event
        Event.fire('Player:disconnect', player, data.reason);
    }
});

Packet.on('IS_VTN', (data) => {
    const player = Public.getByUCID(data.server, data.ucid);
    if(player) {
        // event
        Event.fire('Player:vote', player, data.action);
    }
});

Packet.on('IS_PEN', (data) => {
    const player = Public.getByUCID(data.server, data.ucid);
    if(player) {
        // event
        Event.fire('Player:penalty', player, { oldpen: data.oldpen, newpen: data.newpen, reason: data.reason });
    }
});

Packet.on('IS_TOC', (data) => {
    const player1 = Public.getByUCID(data.server, data.olducid);
    const player2 = Public.getByUCID(data.server, data.newucid);
    if(player1 && player2) {
        // event
        Event.fire('Player:takeOver', player1, player2);
    }
});

Packet.on('IS_CIM', (data) => {
    const player = Public.getByUCID(data.server, data.ucid);
    if(player) {
        // event
        Event.fire('Player:interfaceUpdate', player, data.mode, data.submode, data.seltype);
    }
});

module.exports = Public;