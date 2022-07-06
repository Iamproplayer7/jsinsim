const Packets = require('./packets.js');
const Events = require('./events.js');
const Players = require('./players.js');

class CommandsHandler {
    constructor() {
        this.commands = [];

        // handle IS_MSO packet
        Packets.on('IS_MSO', (data) => {
            if(data.ucid === 0) return;
            
            const player = Players.getByUCID(data.hostName, data.ucid);
            if(player) {
                const message = data.msg.slice(data.textstart, data.msg.length);
                const command = message.split(' ');

                if(data.usertype === 1) {
                    // event
                    Events.fire('Player:message', player, message);
                }
                else if(data.usertype === 2) {
                    this.fire(command[0].slice(1, command[0].length), player, command.slice(1, command.length));
                }
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

module.exports = new CommandsHandler;