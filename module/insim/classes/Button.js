const Packet = require('./Packet.js');
const Event = require('./Event.js');
const Player = require('./Player.js');

class Public {
    static all = [];

    static simple(player, name, group, width, height, top, left, text, style) {
        const button = Public.getByUCIDNameGroup(player.server, player.ucid, name, group);
        if(button) button.update({ width, height, top, left, text2: text, style });

        return button ?? new Button('simple', player, name, group, width, height, top, left, '', text, style);
    }

    static click(player, name, group, width, height, top, left, text, style, inst = false, callback = false) {
        const button = Public.getByUCIDNameGroup(player.server, player.ucid, name, group);
        if(button) button.update({ width, height, top, left, text2: text, style, inst });

        return button ?? new Button('click', player, name, group, width, height, top, left, '', text, style, inst, callback);
    }

    static input(player, name, group, width, height, top, left, text1, text2, style, callback = false, typeIn = 95) {
        const button = Public.getByUCIDNameGroup(player.server, player.ucid, name, group);
        if(button) button.update({ width, height, top, left, text1, text2, style, typeIn });

        return button ?? new Button('input', player, name, group, width, height, top, left, text1, text2, style, 0, callback, typeIn);
    }

    static getByUCID = (server, ucid) => {
        return Public.all.filter((button) => button.valid && server == button.server && button.player.ucid === ucid);
    }

    static getByPlayer = (player) => {
        return Public.getByUCID(player.server, player.ucid);
    }

    static getByUCIDNameGroup = (server, ucid, name, group) => {
        return Public.all.find((button) => button.valid && server == button.server && button.player.ucid === ucid && button.name === name && button.group === group);
    }

    static getByPlayerNameGroup = (player, name, group) => {
        return Public.getByUCIDNameGroup(player.server, player.ucid, name, group);
    }

    static getByUCIDGroup = (server, ucid, group) => {
        return Public.all.filter((button) => button.valid && server == button.server && button.player.ucid === ucid && button.group === group);
    }

    static getByPlayerGroup = (player, group) => {
        return Public.getByUCIDGroup(player.server, player.ucid, group);
    }

    static getByUCIDClickId = (server, ucid, clickId) => {
        return Public.all.find((button) => button.valid && server == button.server && button.player.ucid === ucid && button.clickId === clickId);
    }

    static update = (player, name, group, data) => {
        const button = Public.getByPlayerNameGroup(player, name, group);
        if(button) {
            button.update(data);
        }
    }

    static delete = (player, name, group) => {
        const button = Public.getByUCIDNameGroup(player.server, player.ucid, name, group);
        if(button) {
            button.delete();
        }
    }

    static deleteGroup = (player, group) => {
        const buttons = Public.getByUCIDGroup(player.server, player.ucid, group);
        for(const button of buttons) {
            button.delete();
        }
    }
}

class Button {
    constructor(type, player, name, group, width, height, top, left, text1, text2, style, inst, callback = false, typeIn = 0) {
        // remove last active
        const button = Public.getByUCIDNameGroup(player.server, player.ucid, name, group);
        if(button) button.delete();
        
        this.valid = true;
        this.type = type;
        this.server = player.server;
        this.player = player;
        
        this.name = name;
        this.group = group;
        this.width = width;
        this.height = height;
        this.top = top;
        this.left = left;
        this.text1 = text1;
        this.text2 = text2;
        this.style = type == 'click' || type == 'input' ? style+8 : style;
        this.inst = inst === true ? 128 : 0;
        this.callback = callback;
        this.typeIn = typeIn;

        this.clickId = false;
        this.lastDraw = false;
        this.draw();

        Public.all.push(this);
    }

    update(data) {
        for(const key of Object.keys(data)) {
            if(key == 'style') {
                data[key] = this.type == 'click' || this.type == 'input' ? data[key]+8 : data[key];
            }
            else if(key == 'inst') {
                data[key] = this.type == 'input' ? 0 : (data[key] === true ? 128 : 0);
            }
            
            this[key] = data[key];
        }

        this.draw();
    }

    draw() {
        // generate clickId
        if(!this.clickId) {
            for(var i = 0; i < 200; i++) {
                if(!Public.getByUCIDClickId(this.server, this.player.ucid, i) && this.clickId === false) {
                    this.clickId = i;
                }
            }

            if(this.clickId === false) {
                return console.log('InSim.Button [Class:Button]: Error: ' + this.server.name + ':' + this.player.ucid + ' reached maximum of buttons on screen!');
            }
        }

        var draw = this.lastDraw === false;
        if(this.lastDraw) {
            for(const key of Object.keys(this.lastDraw)) {
                if(this.lastDraw[key] !== this[key]) {
                    draw = true;
                }
            }
        }

        if(draw) {
            this.lastDraw = {
                ucid: this.player.ucid,
                clickid: this.clickId,
                inst: this.inst,
                style: this.style,
                typein: this.typeIn,
                left: this.left,
                top: this.top,
                width: this.width,
                height: this.height,
                text1: this.text1,
                text2: this.text2
            };

            Packet.send(this.player.server, 'IS_BTN', {
                ucid: this.player.ucid,
                reqi: this.clickId + 1,
                clickid: this.clickId,
                inst: this.inst,
                bstyle: this.style,
                typein: this.typeIn,
                l: this.left,
                t: this.top,
                w: this.width,
                h: this.height,
                text: (this.text1 ? "\0" + this.text1 + "\0" + this.text2 : this.text2)
            });
        }
    }

    delete() {
        this.valid = false;
        Public.all = Public.all.filter((button) => button !== this);

        Packet.send(this.player.server, 'IS_BFN', {
            subt: 0,
            ucid: this.player.ucid,
            clickid: this.clickId
        });
    }
}


// HANDLE PACKETS
    // IS_BTC: player click button
    // IS_BTT: player type in input
    // IS_BFN: player press SHIFT+I

Packet.on('IS_BTC', (data) => {
    const button = Public.getByUCIDClickId(data.server, data.ucid, data.clickid);
    if(button) {
        const player = Player.getByUCID(data.server, data.ucid);
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
            Event.fire('Button:click', button, player, cflags[data.cflags]);

            // callback
            if(button.callback) {
                button.callback(button, player, cflags[data.cflags]);
            }
        }
    }
});

Packet.on('IS_BTT', (data) => {
    const button = Public.getByUCIDClickId(data.server, data.ucid, data.clickid);
    if(button) {
        const player = Player.getByUCID(data.server, data.ucid);
        if(player) {
            // event
            Event.fire('Button:text', button, player, data.text);

            // callback
            if(button.callback) {
                button.callback(button, player, data.text);
            }
        }
    }
});

Packet.on('IS_BFN', (data) => {
    const player = Player.getByUCID(data.server, data.ucid);
    if(player) {
        // delete buttons
        for(const button of Public.getByUCID(data.server, data.ucid)) {
            button.delete();
        }

        // clear again
        Packet.send(data.server, 'IS_BFN', { subt: 1, ucid: data.ucid });
        
        // event
        Event.fire('Button:shiftI', player);
    }
});

module.exports = Public;