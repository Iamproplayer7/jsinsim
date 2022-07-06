class ObjectsHandler {
    // private variables
    #Server;
    #Packets;

    constructor(Server, Packets) {
        this.#Server = Server;
        this.#Packets = Packets;

        this.objects = {};

        // handle IS_AXM packets
        // IS_AXM: server || player add/removed/edited layout

        this.#Packets.on('IS_AXM', (data) => {
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

            //console.log('objects', this.objects[data.hostName]);
        });
    }

    length(hostName = false) {
        // host objects length
        if(hostName) {
            if(this.objects[hostName] === undefined) {
                console.log('InSim.Objects.length: Err: trying to count ' + hostName + ' objects. Host is not exists!');
                return false;
            }

            return this.objects[hostName].length;
        }
        // all hosts objects length
        else {
            var length = 0;
            for(const hostName_ of Object.keys(this.objects)) {
                length += this.objects[hostName_].length;
            }
            
            return length;
        }
    }

    all(hostName = false) {
        if(hostName) {
            if(this.objects[hostName] === undefined) {
                console.log('InSim.Objects.all: Err: trying to get ' + hostName + ' objects. Host is not exists!');
                return false;
            }

            return this.objects[hostName];
        }
        else {
            return this.objects;
        }
    }

    add(hostName, object) {
        this.#Packets.send(hostName, 'IS_AXM_PACK', { pmoaction: 1, objects: [ object ]});
    }

    addArray(hostName, objects) {
        if(objects.length > 60) {
            const parts = Math.floor(objects.length / 60);
            const lastPart = objects.length % 60;

            for(var i = 0; i <= parts; i++) {
                if(i === parts) {
                    this.#Packets.send(hostName, 'IS_AXM_PACK', { pmoaction: 1, objects: objects.slice(i*60, i*60+lastPart), ucid: objects[0].ucid !== undefined ? objects[0].ucid : 0 });
                }
                else {
                    this.#Packets.send(hostName, 'IS_AXM_PACK', { pmoaction: 1, objects: objects.slice(i*60, i*60+60), ucid: objects[0].ucid !== undefined ? objects[0].ucid : 0 });
                }
            }
        }
        else {
            this.#Packets.send(hostName, 'IS_AXM_PACK', { pmoaction: 1, objects: objects, ucid: objects[0].ucid !== undefined ? objects[0].ucid : 0 });
        }
    }

    async sendArrayAsync(hostName, objects) {

    }

    async addArrayAsync(hostName, objects) {
        return new Promise(async (resolve) => {
            this.addArray(hostName, objects);

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

    remove(hostName, object) {
        this.#Packets.send(hostName, 'IS_AXM_PACK', { pmoaction: 2, objects: [ object ]});
    }

    removeArray(hostName, objects) {
        if(objects.length > 60) {
            const parts = Math.floor(objects.length / 60);
            const lastPart = objects.length % 60;

            for(var i = 0; i <= parts; i++) {
                if(i === parts) {
                    this.#Packets.send(hostName, 'IS_AXM_PACK', { pmoaction: 2, objects: objects.slice(i*60, i*60+lastPart), ucid: objects[0].ucid !== undefined ? objects[0].ucid : 0 });
                }
                else {
                    this.#Packets.send(hostName, 'IS_AXM_PACK', { pmoaction: 2, objects: objects.slice(i*60, i*60+60), ucid: objects[0].ucid !== undefined ? objects[0].ucid : 0 });
                }
            }
        }
        else {
            this.#Packets.send(hostName, 'IS_AXM_PACK', { pmoaction: 2, objects: objects, ucid: objects[0].ucid !== undefined ? objects[0].ucid : 0 });
        }
    }

    async removeArrayAsync(hostName, objects) {
        return new Promise(resolve => {
            const beforeLength = this.objects[hostName].length;
            this.removeArray(hostName, objects);

            var int = setInterval(() => {
                if(this.objects[hostName].length === beforeLength-objects.length) {
                    clearInterval(int);
                    return resolve(true);
                }
            }, 50)
        })
    }

    move(hostName, object1, object2) {
        this.#Packets.send(hostName, 'IS_AXM_PACK', { pmoaction: 2, objects: [ object1 ]});
        this.#Packets.send(hostName, 'IS_AXM_PACK', { pmoaction: 1, objects: [ object2 ]});
    }
}

module.exports = ObjectsHandler;