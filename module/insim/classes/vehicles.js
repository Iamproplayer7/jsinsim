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
        this.lagging = false;
        this.isOfficial = data.isOfficial;
        
        this.created = Date.now();
        this.resets = [];
    }

    setPosition(pos, repair = false, heading = 0) {
        // degrees to 256 & reverse
        heading = heading * 256 / 360;
        if(heading > 128) {
            heading = heading-128;
        }
        else if(heading < 128) {
            heading = heading+128;
        }

        Packets.send(this.hostName, 'IS_JRR', { plid: this.plid, jrraction: (repair ? 4 : 5), x: pos.x, y: pos.y, z: pos.z, heading: heading });
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
        // IS_CPR: player changes info
        // IS_MCI: vehicle info
        // IS_OBH: vehicle hitted object
        // IS_CON: vehicle hitted other vehicle
        // IS_PIT: vehicle pit stop start
        // IS_PSF: vehicle pit stop end

        Packets.on('IS_NPL', (data) => {
            const player = Players.getByUCID(data.hostName, data.ucid);
            if(player) {
                if(data.nump == 0) {
                    // event
                    Events.fire('Vehicle:joinRequest', data);
                }
                else {
                    const vehicle = new VehicleHandler(player, data);
                    this.vehicles.push(vehicle);
                    player.vehicle = vehicle;

                    // event
                    Events.fire('Vehicle:add', vehicle);
                }
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
                Events.fire('Vehicle:reset', vehicle, vehicle.pos);
            }
        });

        Packets.on('IS_CPR', (data) => {
            const player = Players.getByUCID(data.hostName, data.ucid);

            if(player) {
                if(player.vehicle && player.vehicle.plate !== data.plate) {
                    // event
                    Events.fire('Vehicle:plateUpdate', player.vehicle, { old: player.vehicle.plate, new: data.plate });
                    player.vehicle.plate = data.plate;
                }
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
                    vehicle.lagging = [32, 33, 34, 96, 160].includes(car.info);

                    // event
                    Events.fire('Vehicle:info', vehicle);
                }
            }
        });

        Packets.on('IS_OBH', (data) => {
            const vehicle = this.getByPLID(data.hostName, data.plid);
            if(vehicle) {
                // event
                Events.fire('Vehicle:objectHit', vehicle, data);
            }
        });

        Packets.on('IS_CON', (data) => {
            const vehicle1 = this.getByPLID(data.hostName, data.c1.plid);
            const vehicle2 = this.getByPLID(data.hostName, data.c2.plid);
            if(vehicle1 && vehicle2) {
                // event
                Events.fire('Vehicle:contact', vehicle1, vehicle2, data.c1, data.c2);
            }
        });
        
        Packets.on('IS_PIT', (data) => {
            const player = this.getByPLID(data.hostName, data.plid);
            if(player) {
                // event
                Events.fire('Vehicle:pitStopStart', player);
            }
        });

        Packets.on('IS_PSF', (data) => {
            const player = this.getByPLID(data.hostName, data.plid);
            if(player) {
                // event
                Events.fire('Vehicle:pitStopEnd', player);
            }
        });
    }

    all(hostName = false) {
        if(hostName) {
            return this.vehicles.filter(vehicle => vehicle.hostName === hostName);
        }

        return this.vehicles;
    }

    each(callback) {
        for(const vehicle of this.vehicles) {
            callback(vehicle);
        }
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
                    
                    vehicle.removed = true;
                    this.vehicles.splice(indexOf, 1);
                    deleted = true;
                }
            }
        }

        return deleted;
    }
}

module.exports = new VehiclesHandler;