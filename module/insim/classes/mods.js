const fs = require('fs');
const ini = require('ini');

class ModsHandler {
    // private variables
    #Server;
    #Packets;

    constructor(Server, Packets) {
        this.#Server = Server;
        this.#Packets = Packets;

        this.config = false;
        this.mods = [];
    }

    update() {
        // update file
        if(this.config) {
            fs.writeFileSync(this.config, this.mods.join('\n'));
        }

        for(const hostName of Object.keys(this.#Server.hosts)) {
            this.#Packets.send(hostName, 'IS_MAL_PACK', { mods: this.mods });
        }
    }

    loadFile(filePath) {
        // creating file if not exists
        if(!fs.existsSync(filePath)) {
            console.log('[InSim.Mods.loadFile]: Err: file not found. creating...');
            fs.writeFileSync(filePath, '');
            console.log('[InSim.Mods.loadFile]: file created. it should look like this: \n90D537\n6BDD71\n...\n');
        }
        else {
            const fileData = fs.readFileSync(filePath);
            const mods = fileData.toString().split('\n').filter(mod => mod.length > 0 && mod.length < 4);
            console.log('[InSim.Mods.loadFile]: file loaded. Mods count: ' + mods.length);

            this.mods = mods;
            this.update();
        }

        this.config = filePath;
    }

    add(skinId) {
        if(Array.isArray(skinId)) {
            skinId.forEach((_skinId) => {
                if(this.mods.indexOf(_skinId) === -1) {
                    this.mods.push(_skinId);
                    console.log('[InSim.Mods.add]: added: ' + _skinId);
                }
            })
        }
        else {
            if(this.mods.indexOf(skinId) === -1) {
                this.mods.push(skinId);
                console.log('[InSim.Mods.add]: added: ' + skinId);
            }
        }

        this.update();
    }

    remove(skinId) {
        if(Array.isArray(skinId)) {
            skinId.forEach((_skinId) => {
                const indexOf = this.mods.indexOf(_skinId);
                if(indexOf !== -1) {
                    this.mods.splice(indexOf, 1);
                    console.log('[InSim.Mods.add]: removed: ' + _skinId);
                }
            })
        }
        else {
            const indexOf = this.mods.indexOf(skinId);
            if(indexOf !== -1) {
                this.mods.splice(indexOf, 1);
                console.log('[InSim.Mods.add]: removed: ' + skinId);
            }
        }

        this.update();
    }
}

module.exports = ModsHandler;