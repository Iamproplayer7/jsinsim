const Packets = require('./packets.js');
const Events = require('./events.js');
const Players = require('./players.js');

class VehicleHandler {
    constructor(player, data) {
        this.hostName = data.hostName;
        this.player = player;

        this.plid = data.plid;
        this.plate = data.plate;
        this.cname = data.cname;
        this.sname = data.sname;
        this.hmass = data.hmass;
        this.htres = data.htres;
        this.config = data.config;
        this.fuel = data.fuel;

        this.speed = 0;
        this.pos = false;
        this.direction = 0;
        this.heading = 0;
        
        this.created = Date.now();
        this.resets = [];
    }

    setPosition(pos, repair = false) {
        // heading not working properly
        Packets.send(this.hostName, 'IS_JRR', { plid: this.plid, jrraction: (repair ? 4 : 5), x: pos.x, y: pos.y, z: pos.z, heading: 0 });
    }

    delete() {
        Packets.send(this.hostName, 'IS_MST', { text: '/spec ' + this.player.uname });  
    }
}

class VehiclesHandler {
    constructor() {
        this.vehicles = [];

        // handle IS_NPL & IS_PLL & IS_PLP & IS_CRS & IS_MCI
        // IS_NPL: player join track
        // IS_PLL: player spectate
        // IS_PLP: player pit
        // IS_CRS: player resets vehicle
        // IS_MCI: vehicle info

        Packets.on('IS_NPL', (data) => {
            const player = Players.getByUCID(data.hostName, data.ucid);
            if(player) {
                const vehicle = new VehicleHandler(player, data);
                this.vehicles.push(vehicle);
                player.vehicle = vehicle;

                // event
                Events.fire('Vehicle:add', vehicle);
            }
        });

        Packets.on(['IS_PLL', 'IS_PLP'], (data) => {
            const vehicle = this.getByPLID(data.hostName, data.plid);
            const deleted = this.deleteByPLID(data.hostName, data.plid);
            if(deleted) {
                // event
                Events.fire('Vehicle:remove', vehicle);
            }
        });

        Packets.on('IS_CRS', (data) => {
            const vehicle = this.getByPLID(data.hostName, data.plid);
            if(vehicle) {
                vehicle.resets.push({ date: Date.now(), pos: vehicle.pos });
                // event
                Events.fire('Vehicle:reset', vehicle);
            }
        });

        Packets.on('IS_MCI', (data) => {
            for(const car of data.compcar) {
                const vehicle = this.getByPLID(data.hostName, car.plid);
                if(vehicle) {
                    vehicle.speed = car.speed;
                    vehicle.pos = { x: car.x, y: car.y, z: car.z };
                    vehicle.direction = car.direction;
                    vehicle.heading = car.heading;

                    // event
                    Events.fire('Vehicle:info', vehicle);
                }
            }
        });
    }

    all(hostName = false) {
        if(hostName) {
            const host = Server.hosts[hostName];
            if(host === undefined) {
                throw 'InSim.Vehicles.all: err: host ' + hostName + ' configuration not defined!';
            }

            return this.vehicles.filter(vehicle => vehicle.hostName === hostName);
        }

        return this.vehicles;
    }

    getByPLID(hostName, plid) {
        var exists = false;
        for(const vehicle of this.vehicles) {
            if(vehicle.hostName == hostName && vehicle.plid == plid) {
                exists = vehicle;
            }
        }

        return exists;
    }

    deleteByPLID(hostName, plid) {
        var deleted = false;
        for(const vehicle of this.vehicles) {
            if(vehicle.hostName == hostName && vehicle.plid == plid) {
                const indexOf = this.vehicles.indexOf(vehicle);
                if(indexOf !== -1) {
                    // remove vehicle from player
                    if(vehicle.player) {
                        vehicle.player.vehicle = false;
                    }

                    this.vehicles.splice(indexOf, 1);
                    deleted = true;
                }
            }
        }

        return deleted;
    }
}

module.exports = new VehiclesHandler;