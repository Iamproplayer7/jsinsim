class Interval {
    static all = [];

    static setInterval = (name, callback, ms) => {
        const interval = Interval.all.find(interval => interval.name === name);
        if(interval) {
            return console.log('[Interval] Failed to create! (Interval ' + interval.name + ' already exists)');
        }

        Interval.all.push({ name, id: setInterval(callback, ms) });
    }

    clearInterval(name) {
        const interval = Interval.all.find(interval => interval.name === name);
        if(interval) {
            clearInterval(interval.id);
            Interval.all = Interval.all.filter((interval_) => interval_ !== interval);
        }
    }
}

module.exports = Interval;