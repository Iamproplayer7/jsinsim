const Packets = require('./packets.js');
const Events = require('./events.js');
const Players = require('./players.js');

class ButtonsHandler {
    constructor() {
        this.buttons = {};

        // handle IS_BTC & IS_BTT & IS_BFN packets
        // IS_BTC: player click button
        // IS_BTT: player type in input
        // IS_BFN: player press SHIFT+I

        Packets.on('IS_BTC', (data) => {
            const button = this.getByUCIDClickId(data.hostName, data.ucid, data.clickid);
            if(button) {
                const player = Players.getByUCID(data.hostName, data.ucid);
                if(player) {
                    const cflags = {
                        1: 'left click',
                        2: 'right click',
                        4: 'ctrl + click',
                        5: 'ctrl + left click',
                        6: 'ctrl + right click',
                        8: 'shift + click',
                        9: 'shift + left click',
                        10: 'shift + right click'
                    }

                    // event
                    Events.fire('Buttons:click', player, button, cflags[data.cflags]);

                    // callback
                    if(button.callback) {
                        button.callback(player, cflags[data.cflags]);
                    }
                }
            }
        });

        Packets.on('IS_BTT', (data) => {
            const button = this.getByUCIDClickId(data.hostName, data.ucid, data.clickid);
            if(button) {
                const player = Players.getByUCID(data.hostName, data.ucid);
                if(player) {
                    button.callback(player, data.text);

                    // event
                    Events.fire('Buttons:text', player, button, data.text);
                }
            }
        });

        Packets.on('IS_BFN', (data) => {
            const player = Players.getByUCID(data.hostName, data.ucid);
            if(player) {
                if(this.buttons[player.hostName] === undefined || this.buttons[player.hostName][player.ucid] === undefined) return;
                this.buttons[player.hostName][player.ucid] = [];

                // event
                Events.fire('Buttons:shiftI', player);
            }
        });
    }

    getByUCIDNameGroup(hostName, ucid, name, group) {
        if(this.buttons[hostName] === undefined || this.buttons[hostName][ucid] === undefined) return false;

        var exists = false;
        for(const button of this.buttons[hostName][ucid]) {
            if(button !== undefined && button.name == name && button.group == group) {
                exists = button;
            }
        }

        return exists;
    }

    getByUCIDGroup(hostName, ucid, group) {
        if(this.buttons[hostName] === undefined || this.buttons[hostName][ucid] === undefined) return false;

        var exists = [];
        for(const button of this.buttons[hostName][ucid]) {
            if(button !== undefined && button.group == group) {
                exists.push(button);
            }
        }

        return exists;
    }

    getByUCIDClickId(hostName, ucid, clickId) {
        if(this.buttons[hostName] === undefined || this.buttons[hostName][ucid] === undefined) return false;

        var exists = false;
        for(const button of this.buttons[hostName][ucid]) {
            if(button !== undefined && button.clickId == clickId) {
                exists = button;
            }
        }

        return exists;
    }

    create(player, type, name, group, width, height, top, left, text1, text2, style, inst, callback = false, typeIn = 0) {
        // define array if array for player is not defined
        if(this.buttons[player.hostName] === undefined) {
            this.buttons[player.hostName] = {};
        }
        if(this.buttons[player.hostName][player.ucid] === undefined) {
            this.buttons[player.hostName][player.ucid] = [];
        }

        var exists = this.getByUCIDNameGroup(player.hostName, player.ucid, name, group);
        var clickId = exists ? exists.clickId : false;

        if(!exists) {
            for(var i = 0; i < 200; i++) {
                if(this.buttons[player.hostName][player.ucid][i] === undefined && clickId === false) {
                    clickId = i;
                }
            }

            // if there no space for button
            if(clickId === false) {
                return console.log('InSim.Buttons.create: err: ' + player.hostName + ':' + player.ucid + ' reached maximum of buttons on screen!');
            }
        }
       
        // style for click || textInput
        style += (type == "click" || type == "input") ? 8 : 0;

        const BTN = {
            host: player.hostName,
            ucid: player.ucid,
            clickId: clickId,
            type: type,
            name: name,
            group: group, 
            width: Math.floor(width),
            height: Math.floor(height),
            top: Math.floor(top),
            left: Math.floor(left),
            text1: text1,
            text2: text2,
            style: style,
            inst: inst,
            typeIn: typeIn,
            callback: callback
        }

        var update = false;
        if(exists) {
            if(exists.text1 !== BTN.text1 || exists.text2 !== BTN.text2 || exists.style !== BTN.style || exists.width !== BTN.width || exists.height !== BTN.height || exists.top !== BTN.top || exists.left !== BTN.left) {
                update = true;
            }
        }
        
        // send this if button not exists or exists with updated items
        if(!exists || update) {
            this.buttons[player.hostName][player.ucid][clickId] = BTN;

            Packets.send(player.hostName, 'IS_BTN', {
                ucid: player.ucid,
                reqi: clickId + 1,
                clickid: clickId,
                inst: (inst ? (type == "input" ? 0 : 128) : 0),
                bstyle: style,
                typein: typeIn,
                l: left,
                t: top,
                w: width,
                h: height,
                text: (text1 ? "\0" + text1 + "\0" + text2 : text2)
            });
        }
    }

    createSimple(player, name, group, width, height, top, left, text, style, inst = false) {
        this.create(player, 'simple', name, group, width, height, top, left, false, text, style, inst);
    }

    createClick(player, name, group, width, height, top, left, text, style, inst = false, callback) {
        this.create(player, 'click', name, group, width, height, top, left, false, text, style, inst, callback, 0);
    }

    createInput(player, name, group, width, height, top, left, text1, text2, style, callback, typeIn = 95) {
        this.create(player, 'input', name, group, width, height, top, left, text1, text2, style, false, callback, typeIn);
    }

    delete(player, name, group) {
        const button = this.getByUCIDNameGroup(player.hostName, player.ucid, name, group);
        if(button) {
            Packets.send(player.hostName, 'IS_BFN', {
                subt: 0,
                ucid: player.ucid,
                clickid: button.clickId
            });

            this.buttons[player.hostName][player.ucid][button.clickId] = undefined;
        }
    }

    deleteGroup(player, group) {
        const buttons = this.getByUCIDGroup(player.hostName, player.ucid, group);
        if(buttons) {
            for(const button of buttons) {
                this.delete(player, button.name, button.group);
            }
        }
    }
}

module.exports = new ButtonsHandler;