class CommandsHandler {
    // private variables
    #Server;
    #Packets;
    #Players;

    constructor(Server, Packets, Players) {
        this.#Server = Server;
        this.#Packets = Packets;
        this.#Players = Players;

        this.commands = [];

        // handle IS_MSO packet
        this.#Packets.on('IS_MSO', (data) => {
            if(data.ucid === 0 || data.usertype !== 2) return;
            
            const player = this.#Players.getByUCID(data.hostName, data.ucid);
            if(player) {
                const message = data.msg.slice(data.textstart, data.msg.length).split(' ');
                this.fire(message[0].slice(1, message[0].length), player, message.slice(1, message.length));
            }
        })
    }

    on(name, callback) {
        if(Array.isArray(name)) {
            for(const name_ of name) {
                this.commands.push({ name: name_, callback: callback });
            }
        }
        else {
            this.commands.push({ name: name, callback: callback });
        }
    }

    fire(name, ...args) {
        for(const command of this.commands) {
            if(command.name === name) {
                command.callback(...args);
            }
        }
    }
}

module.exports = CommandsHandler;