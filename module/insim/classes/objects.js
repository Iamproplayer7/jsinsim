const Server = require('../server.js');
const Packets = require('./packets.js');

class ObjectsHandler {
    constructor() {
        this.objects = {};

        // handle IS_AXM packets
        // IS_AXM: server || player add/removed/edited layout

        Packets.on('IS_AXM', (data) => {
            if(this.objects[data.hostName] === undefined) {
                this.objects[data.hostName] = [];
            }

            // add objects
            if(data.pmoaction === 0 || data.pmoaction === 1 || data.pmoaction === 4) {
                data.objects.forEach((object) => {
                    this.objects[data.hostName].push(object);
                });
            }
            
            // clear objects
            if(data.pmoaction === 3) {
                this.objects[data.hostName] = [];
            }

            // remove objects
            if(data.pmoaction === 2) {
                data.objects.forEach((object) => {
                    this.objects[data.hostName].forEach((object_, key) => {
                        if(JSON.stringify(object) == JSON.stringify(object_)) {
                            this.objects[data.hostName].splice(key, 1);
                        }
                    })
                })
            }
        });
    }

    all(hostName = false) {
        if(hostName) {
            if(this.objects[hostName] === undefined) {
                console.log('InSim.Objects.all: Objects not loaded yet!');
                return false;
            }

            return this.objects[hostName];
        }
        else {
            return this.objects;
        }
    }

    // private
    #send(hostName, action, object) {
        if(!Server.getHostByName(hostName)) {
            console.log('InSim.Objects.send: host (' + hostName + ') not found!');
            return false;
        }

        Packets.send(hostName, 'IS_AXM_PACK', { pmoaction: action, objects: [ object ]});
    }

    #sendArray(hostName, action, objects) {
        if(objects.length > 60) {
            const parts = Math.floor(objects.length / 60);
            const lastPart = objects.length % 60;

            for(var i = 0; i <= parts; i++) {
                if(i === parts) {
                    Packets.send(hostName, 'IS_AXM_PACK', { pmoaction: action, objects: objects.slice(i*60, i*60+lastPart), ucid: objects[0].ucid !== undefined ? objects[0].ucid : 0 });
                }
                else {
                    Packets.send(hostName, 'IS_AXM_PACK', { pmoaction: action, objects: objects.slice(i*60, i*60+60), ucid: objects[0].ucid !== undefined ? objects[0].ucid : 0 });
                }
            }
        }
        else {
            Packets.send(hostName, 'IS_AXM_PACK', { pmoaction: action, objects: objects, ucid: objects[0].ucid !== undefined ? objects[0].ucid : 0 });
        }
    }
    // private end...

    add(hostName, objects) {
        if(Array.isArray(objects)) {
            this.#sendArray(hostName, 1, objects);
        }
        else {
            this.#send(hostName, 1, objects);
        }
    }

    async addAsync(hostName, objects) {
        return new Promise(async (resolve) => {
            this.add(hostName, objects);

            var int = setInterval(() => {
                var loaded = 0;
                for(const object of this.objects[hostName]) {
                    for(const object_ of objects) {
                        if(object.x === object_.x && object.y === object_.y) {
                            loaded++;
                        }
                    }
                }
                
                if(loaded === objects.length) {
                    clearInterval(int);
                    return resolve(true);
                }
            }, 50);
        })
    }

    remove(hostName, objects) {
        if(Array.isArray(objects)) {
            this.#sendArray(hostName, 2, objects);
        }
        else {
            this.#send(hostName, 2, objects);
        }
    }

    async removeAsync(hostName, objects) {
        return new Promise(async (resolve) => {
            const before = this.objects[hostName].length;
            this.remove(hostName, objects);
            
            var int = setInterval(() => {
                if(this.objects[hostName].length === before-objects.length) {
                    clearInterval(int);
                    return resolve(true);
                }
            }, 50);
        })
    }

    move(hostName, object1, object2) {
        this.#send(hostName, 2, object1);
        this.#send(hostName, 1, object2);
    }
}

module.exports = new ObjectsHandler;