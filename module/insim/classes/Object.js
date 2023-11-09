const Packet = require('./Packet');
const Event = require('./Event');
const Player = require('./Player');

class Object {
    static all = [];

    // private send
    static #send = (server, action, object) => {
        Packet.send(server, 'IS_AXM_PACK', { pmoaction: action, objects: [ object ]});
    }

    // private sendArray
    static #sendArray = (server, action, objects) => {
        if(objects.length < 1) return;
        if(objects.length > 60) {
            const parts = Math.floor(objects.length / 60);
            const lastPart = objects.length % 60;

            for(var i = 0; i <= parts; i++) {
                // last part
                if(i === parts) {
                    Packet.send(server, 'IS_AXM_PACK', { pmoaction: action, pmoflags: 9, objects: objects.slice(i*60, i*60+lastPart), ucid: objects[0].ucid !== undefined ? objects[0].ucid : 0 });
                }
                else {
                    Packet.send(server, 'IS_AXM_PACK', { pmoaction: action, pmoflags: 8, objects: objects.slice(i*60, i*60+60), ucid: objects[0].ucid !== undefined ? objects[0].ucid : 0 });
                }
            }
        }
        else {
            Packet.send(server, 'IS_AXM_PACK', { pmoaction: action, pmoflags: 9, objects, ucid: objects[0].ucid !== undefined ? objects[0].ucid : 0 })
        }
    }

    static add = (server, objects) => {
        if(Array.isArray(objects)) {
            this.#sendArray(server, 1, objects);
        }
        else {
            this.#send(server, 1, objects);
        }
    }

    static addAsync = (server, objects) => {
        return new Promise((resolve) => {
            var i = setInterval(() => {
                var loaded = 0;
                for(const object of Object.all) {
                    for(const objectToLoad of objects) {
                        if(object.x === objectToLoad.x && object.y === objectToLoad.y) {
                            loaded++;
                        }
                    }
                }

                if(loaded === objects.length) {
                    clearInterval(i);
                    return resolve(true);
                }
            }, 50);

            Object.add(server, objects);
        });
    }

    static remove = (server, objects) => {
        if(Array.isArray(objects)) {
            this.#sendArray(server, 2, objects);
        }
        else {
            this.#send(server, 2, objects);
        }
    }

    static removeAsync = (server, objects) => {
        return new Promise((resolve) => {
            var i = setInterval(() => {
                const before = Object.all.filter((object) => object.server === server).length;
                if(before-objects.length === Object.all.filter((object) => object.server === server).length) {
                    clearInterval(i);
                    return resolve(true);
                }
            }, 50);

            Object.remove(server, objects);
        });
    }

    static move = (server, object1, object2) => {
        this.#send(server, 2, object1);
        this.#send(server, 1, object2);
    }
}

// HANDLE PACKETS
    // IS_AXM

Packet.on('IS_AXM', (data) => {
    // object updated
    if(data.pmoaction === 1 && data.pmoflags === 2) {
        for(const object of data.objects) {
            // event
            Event.fire('Object:update', data.server, Player.getByUCID(data.server, data.ucid), object);
        }
    }

    // object added
    if(data.pmoaction === 0 || data.pmoaction === 1 || data.pmoaction === 4) {
        for(const object of data.objects) {
            Object.all.push(object);

            // event
            Event.fire('Object:add', data.server, Player.getByUCID(data.server, data.ucid), object);
        }
    }

    // object removed
    if(data.pmoaction === 2) {
        for(const object of data.objects) {
            const objectRemoved = Object.all.find((obj) => JSON.stringify(obj) === JSON.stringify(object));
            if(objectRemoved) {
                Object.all = Object.all.filter((obj) => obj !== objectRemoved);

                // event
                Event.fire('Object:remove', data.server, Player.getByUCID(data.server, data.ucid), objectRemoved);
            } 
        }
    }

    // clear objects action
    if(data.pmoaction === 3) {
        Object.all = [];

        // event
        Event.fire('Object:clear', data.server, Player.getByUCID(data.server, data.ucid));
    }
});

module.exports = Object;