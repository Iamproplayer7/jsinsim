const InSim = require('../module/insim');
InSim.Server.start();

InSim.Packets.on('IS_VER', (data) => {
    InSim.Packets.send(data.hostName, 'IS_MTC', { ucid: 255, plid: 0, text: '^2InSim connected!' })

    setInterval(() => {
        InSim.Players.all().forEach((player) => {
            InSim.Buttons.createSimple(player, 'test', 'test', 20, 5, 100, 100, '^1testukas', 32, true);
            InSim.Buttons.createClick(player, 'testas', 'testas', 20, 5, 105, 100, '^1testukas', 32, false, (player, click) => {
                
            });
            InSim.Buttons.createInput(player, 'testas2', 'testas', 20, 5, 110, 100, '^1testukas', 'testukas', 32, (player, text) => {
                console.log(text)
            });
        })
    }, 100);
});


InSim.Commands.on('test', (player, args) => {
    player.vehicle.setPosition(player.vehicle.pos, true);
})

