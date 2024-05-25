const Packet = require('./Packet.js');
const Event = require('./Event.js');
const Player = require('./Player.js');

class Command {
    static all = [];
    static on(name, callback) {
        name = name.toLowerCase();

        if(Array.isArray(name)) {
            for(const key of name) {
                Command.all.push({ name: key, callback });
            }
        }
        else {
            Command.all.push({ name, callback });
        }
    }
    static off(name) {
        Command.all = Command.all.filter((command) => command.name !== name);
    }
    static fire(name, ...args) {
        const commands = Command.all.filter((command) => command.name === name.toLowerCase());
        for(const command of commands) {
            command.callback(...args);
        }
    }
}

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
            Command.fire(command[0].slice(1, command[0].length), player, ...command.slice(1, command.length));
        }
    }
})

module.exports = Command;