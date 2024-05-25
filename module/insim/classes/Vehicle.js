const Packet = require('./Packet.js');
const Event = require('./Event.js');
const Player = require('./Player.js');

class Public {
    static all = [];

    static getByPLID(server, plid) {
        return Public.all.find((vehicle) => server == vehicle.server && vehicle.plid == plid);
    }

    static getByKey(server, key, value) {
        return Public.all.find((vehicle) => server === vehicle.server && vehicle[key] === value);
    }

    static deleteByPLID(server, plid) {
        var deleted = false;

        const vehicle = Public.getByPLID(server, plid);
        if(vehicle) {
            deleted = true;
            vehicle.valid = false;
            vehicle.player.vehicle = false;
            Public.all = Public.all.filter((vehicle_) => vehicle_ !== vehicle);
        }
        

        return deleted;
    }
}

class Vehicle {
    constructor(server, player, plid, plate, cname, sname, hmass, htres, config, fuel, isOfficial) {
        this.valid = true;
        this.server = server;
        this.player = player;

        // add vehicle to player
        player.vehicle = this;

        this.plid = plid;
        this.plate = plate;
        this.cname = cname;
        this.sname = sname;
        this.hmass = hmass;
        this.htres = htres;
        this.config = config;
        this.fuel = fuel;
        this.isOfficial = isOfficial;

        // info
        this.speed = 0;
        this.pos = false;
        this.heading = 0;
        this.direction = 0;
        this.lagging = false;
        
        // additional
        this.created = Date.now();
        this.resets = [];

        Public.all.push(this);
    }

    setPosition(pos, repair = false, heading = 0) {
        // degrees to 256 & reverse
        heading = heading * 256 / 360;
        heading = Math.floor(heading > 128 ? heading-128 : heading+128);
  
        Packet.send(this.server, 'IS_JRR', { plid: this.plid, jrraction: (repair ? 4 : 5), x: pos.x, y: pos.y, z: pos.z, heading });
    }

    delete() {
        Packet.send(this.server, 'IS_MST', { text: '/spec ' + this.player.uname });  
    }
}

// HANDLE PACKETS
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

Packet.on('IS_NPL', (data) => {
    const player = Player.getByUCID(data.server, data.ucid);
    if(player) {
        if(data.nump == 0) {
            // event
            const response = Event.fire('Vehicle:joinRequest', player, data);
            Packet.send(player.server, 'IS_JRR', { ucid: player.ucid, jrraction: (response.includes(true) ? 1 : 0) });
        }
        else {
            // event
            Event.fire('Vehicle:add', new Vehicle(player.server, player, data.plid, data.plate, data.cname, data.sname, data.hmass, data.htres, data.config, data.fuel, data.isOfficial), player);
        }
    }
});

Packet.on(['IS_PLL', 'IS_PLP'], (data) => {
    const vehicle = Public.getByPLID(data.server, data.plid);
    if(vehicle) {
        const player = vehicle.player;
        const deleted = Public.deleteByPLID(data.server, data.plid);
    
        if(deleted) {
            // event
            Event.fire('Vehicle:remove', vehicle, player);
        }    
    }
});

Packet.on('IS_CRS', (data) => {
    const vehicle = Public.getByPLID(data.server, data.plid);
    if(vehicle) {
        const ins = { date: Date.now(), pos: vehicle.pos };
        vehicle.resets.push(ins);

        // event
        Event.fire('Vehicle:reset', vehicle, ins);
    }
});

Packet.on('IS_CPR', (data) => {
    const player = Player.getByUCID(data.server, data.ucid);
    if(player) {
        if(player.vehicle && player.vehicle.plate !== data.plate) {
            // event
            Event.fire('Vehicle:plateUpdate', player.vehicle, { old: player.vehicle.plate, new: data.plate });
            player.vehicle.plate = data.plate;
        }
    }
});

Packet.on('IS_MCI', (data) => {
    for(const car of data.compcar) {
        const vehicle = Public.getByPLID(data.server, car.plid);
        if(vehicle) {
            vehicle.speed = car.speed;
            vehicle.pos = { x: car.x, y: car.y, z: car.z };
            vehicle.heading = car.heading;
            vehicle.direction = car.direction;
            vehicle.lagging = [32, 33, 34, 96, 160].includes(car.info);

            // event
            Event.fire('Vehicle:info', vehicle);
        }
    }
});

Packet.on('IS_OBH', (data) => {
    const vehicle = Public.getByPLID(data.server, data.plid);
    if(vehicle) {
        // event
        Event.fire('Vehicle:objectHit', vehicle, data);
    }
});

Packet.on('IS_CON', (data) => {
    const vehicle1 = Public.getByPLID(data.server, data.c1.plid);
    const vehicle2 = Public.getByPLID(data.server, data.c2.plid);
    if(vehicle1 && vehicle2) {
        // event
        Event.fire('Vehicle:contact', vehicle1, vehicle2);
    }
});

Packet.on('IS_PIT', (data) => {
    const vehicle = Public.getByPLID(data.server, data.plid);
    if(vehicle) {
        // event
        Event.fire('Vehicle:pitStopStart', vehicle);
    }
});

Packet.on('IS_PSF', (data) => {
    const vehicle = Public.getByPLID(data.server, data.plid);
    if(vehicle) {
        // event
        Event.fire('Vehicle:pitStopEnd', vehicle);
    }
});

module.exports = Public;