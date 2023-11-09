const Packet = require('./Packet.js');
const Event = require('./Event.js');
const Player = require('./Player.js');

class Command {
    static all = [];

    constructor() {
        // handle IS_MSO packet
        Packet.on('IS_MSO', (data) => {
            if(data.ucid === 0) return;
            
            const player = Player.getByUCID(data.server, data.ucid);
            if(player) {
                const message = data.msg.slice(data.textstart, data.msg.length);
                const command = message.split(' ');

                if(data.usertype === 1) {
                    // event
                    Event.fire('Player:message', player, message);
                }
                else if(data.usertype === 2) {
                    this.fire(command[0].slice(1, command[0].length), player, ...command.slice(1, command.length));
                }
            }
        })
    }

    on(name, callback) {
        if(Array.isArray(name)) {
            for(const key of name) {
                Command.all.push({ name: key, callback });
            }
        }
        else {
            Command.all.push({ name, callback });
        }
    }

    off(name) {
        Command.all = Command.all.filter((command) => command.name !== name);
    }

    fire(name, ...args) {
        const commands = Command.all.filter((command) => command.name === name);
        for(const command of commands) {
            command.callback(...args);
        }
    }
}

module.exports = new Command;