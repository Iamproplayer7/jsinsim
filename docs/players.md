## Players
You can use this class: `InSim.Players`. 
```js
InSim.Players.each(callback: (player)); // call callback on each player
InSim.Players.all(hostName | false); // get players in specified host || all players in all hosts
InSim.Players.getByUCID(hostName, plid); // get player by hostName & UCID
InSim.Players.getByKey(hostName, key, value); // get player by hostName & key & value
InSim.Players.getByUName(hostName, uname); // get player by hostName & uname (license name)
InSim.Players.deleteByUID(hostName, ucid); // delete player from players by hostName & UCID (do not use unless you know what are you doing!!!)

// player:
/*
hostName    : player host name where it is exists
ucid        : player unique id
uname       : player license name
pname       : player name
admin       : is player authorized as admin
language    : player language
userid      : player license id
ip          : player ip
vehicle     : player current vehicle
*/

player.message(text, sound || 0); // send message to player and play sound (optional)
player.kick(); // kick player
player.ban(hours || 0); // ban player for specifed hours (0 for 12h)
player.allowVehicles(vehicles); // allow default vehicles for player like UF1, XFG... vehicles = ['UF1', 'XFG']
```

## Example
```js
// delete all vehicles
InSim.Players.each(player => {
    player.message('^1This is example!');
});
```