## Vehicles
You can use this class: `InSim.Vehicles`. 
```js
InSim.Vehicles.each(callback: (vehicle)); // call callback on each vehicle
InSim.Vehicles.all(hostName | false); // get vehicles in specified host || all vehicles in all hosts
InSim.Vehicles.getByPLID(hostName, plid); // get vehicle by hostName & PLID
InSim.Vehicles.deleteByPLID(hostName, plid); // delete vehicle by hostName & PLID (do not use if you want remove vehicle from track, use vehicle.delete(); instead)

// vehicle:
/*
hostName     : vehicle host name where exists
player       : vehicle player (owner)
plid         : vehicle plid
plate        : vehicle number plate
cname        : vehicle name
sname        : vehicle skin name
hmass        : vehicle mass (kg)
htres        : vehicle intake restriction
config       : vehicle configuration 
fuel         : vehicle fuel percent if /showfuel yes enabled
speed        : vehicle speed (km/h)
pos          : vehicle position
direction    : vehicle direction
heading      : vehicle heading
created      : vehicle creation date (when player joined track)
resets       : vehicle resets (when and where player reseted his vehicle)
*/

vehicle.setPosition(pos, repair || false, heading || 0); // set vehicle position, repair it (optional), set heading (optional)
vehicle.delete(); // remove vehicle from track (sets player into spectate mode)
```

## Example
```js
// delete all vehicles
InSim.Vehicles.each(vehicle => {
    vehicle.player.message('^1Your vehicle was removed from track');
    vehicle.delete();
});
```
