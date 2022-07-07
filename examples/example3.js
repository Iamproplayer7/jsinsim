// this example shows how you can use buttons.

// this how it looks ingame
// https://i.imgur.com/jSnOBpu.png

const InSim = require('../module/insim');

InSim.Server.start({
    host1: {
        ip: '188.122.74.155',
        port: 53330,
        admin: 'testas',
        prefix: '!',
        pps: 12
    }
}, (hostName) => {
    InSim.Server.message(hostName, '^2InSim: Node.js connected.');
});

// interval to show buttons
var clicks = 0;
var lastInput = '^2This is input button.';
setInterval(() => {
    InSim.Players.each(player => {
        // styles and colors
        InSim.Buttons.createSimple(player, 'example 1', 'EXAMPLE', 30, 4, 50, 70, '^0This is simple button.', 0);
        InSim.Buttons.createSimple(player, 'example 2', 'EXAMPLE', 30, 4, 54, 70, '^1This is simple button.', 64);
        InSim.Buttons.createSimple(player, 'example 3', 'EXAMPLE', 30, 4, 58, 70, '^2This is simple button.', 128);
        InSim.Buttons.createSimple(player, 'example 4', 'EXAMPLE', 30, 4, 62, 70, '^3This is simple button.', 16);
        InSim.Buttons.createSimple(player, 'example 5', 'EXAMPLE', 30, 4, 66, 70, '^4This is simple button.', 64+16);
        InSim.Buttons.createSimple(player, 'example 6', 'EXAMPLE', 30, 4, 70, 70, '^5This is simple button.', 128+16);
        InSim.Buttons.createSimple(player, 'example 7', 'EXAMPLE', 30, 4, 74, 70, '^6This is simple button.', 32);
        InSim.Buttons.createSimple(player, 'example 8', 'EXAMPLE', 30, 4, 78, 70, '^7This is simple button.', 64+32);
        InSim.Buttons.createSimple(player, 'example 9', 'EXAMPLE', 30, 4, 82, 70, 'This is simple button.', 128+32);

        InSim.Buttons.createClick(player, 'example 10', 'EXAMPLE', 30, 5, 75, 110, '^2This is click button. (' + clicks + ')', 32, false, (player, click) => {
            // when click left, shift + left, ctrl + left: increase 1
            if(click.includes('left')) {
                clicks++;
            }
            // when click right, shift + right, ctrl + right: decrease 1
            else if(click.includes('right')) {
                clicks--;
            }
        });
        InSim.Buttons.createInput(player, 'example 11', 'EXAMPLE', 30, 4, 80, 110, '^2hello', lastInput, 32, (player, text) => {
            lastInput = text;
        });
    })
}, 100);