class PlayerHandler {
    // private variables
    #Packets;

    constructor(Packets, data) {
        this.#Packets = Packets;

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
        this.#Packets.send(this.hostName, 'IS_MTC', { ucid: 255, text: text, sound: sound });
    }
}

class PlayersHandler {
    // private variables
    #Server;
    #Packets;

    constructor(Server, Packets) {
        this.#Server = Server;
        this.#Packets = Packets;

        this.players = [];

        // handle IS_NCN & IS_NCI & IS_CNL packets
        // IS_NCN: player connect
        // IS_NCI: player connect info
        // IS_CNL: player disconnect

        this.#Packets.on('IS_NCN', (data) => {
            if(data.ucid === 0) return;
            this.players.push(new PlayerHandler(this.Packets, data));
        });

        this.#Packets.on('IS_NCI', (data) => {
            const player = this.getByUCID(data.hostName, data.ucid);
            if(player) {
                player.language = data.language;
                player.userid = data.userid;
                player.ip = data.ipaddress;
            }
        });

        this.#Packets.on('IS_CNL', (data) => {
            const deleted = this.deleteByUCID(data.hostName, data.ucid);
            if(deleted) {
                // player deleted
            }
        });
    }

    all(hostName = false) {
        if(hostName) {
            const host = this.Server.hosts[hostName];
            if(host === undefined) {
                throw 'InSim.Players.all: err: host ' + hostName + ' configuration not defined!';
            }

            return this.players.filter(player => player.hostName === hostName);
        }

        return this.players;
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

module.exports = PlayersHandler;