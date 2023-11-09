// this example shows how you can use buttons.

// this how it looks ingame
// https://i.imgur.com/jSnOBpu.png

const InSim = require('../module/insim');

const Server = new InSim.Server('hostName', '188.122.74.155', 52634, 'test', '!', 12);
Server.onConnect(() => {
    Server.message('^2InSim: Node.js connected.');
});

// interval to show buttons
var clicks = 0;
var lastInput = '^2This is input button.';

Server.setInterval('buttons', () => {
    for(const player of InSim.Player.all) {
        // styles and colors
        InSim.Button.simple(player, 'example 1', 'EXAMPLE', 30, 4, 50, 70, '^0This is simple button.', 0);
        InSim.Button.simple(player, 'example 2', 'EXAMPLE', 30, 4, 54, 70, '^1This is simple button.', 64);
        InSim.Button.simple(player, 'example 3', 'EXAMPLE', 30, 4, 58, 70, '^2This is simple button.', 128);
        InSim.Button.simple(player, 'example 4', 'EXAMPLE', 30, 4, 62, 70, '^3This is simple button.', 16);
        InSim.Button.simple(player, 'example 5', 'EXAMPLE', 30, 4, 66, 70, '^4This is simple button.', 64+16);
        InSim.Button.simple(player, 'example 6', 'EXAMPLE', 30, 4, 70, 70, '^5This is simple button.', 128+16);
        InSim.Button.simple(player, 'example 7', 'EXAMPLE', 30, 4, 74, 70, '^6This is simple button.', 32);
        InSim.Button.simple(player, 'example 8', 'EXAMPLE', 30, 4, 78, 70, '^7This is simple button.', 64+32);
        InSim.Button.simple(player, 'example 9', 'EXAMPLE', 30, 4, 82, 70, 'This is simple button.', 128+32);

        InSim.Button.click(player, 'example 10', 'EXAMPLE', 30, 5, 75, 110, '^2This is click button. (' + clicks + ')', 32, false, (button, player, click) => {
            // when click left, shift + left, ctrl + left: increase 1
            if(click.includes('left')) {
                clicks++;
            }
            // when click right, shift + right, ctrl + right: decrease 1
            else if(click.includes('right')) {
                clicks--;
            }
        });

        InSim.Button.input(player, 'example 11', 'EXAMPLE', 30, 4, 80, 110, '^2hello', lastInput, 32, (button, player, text) => {
            lastInput = text;
        });
    }
}, 100);