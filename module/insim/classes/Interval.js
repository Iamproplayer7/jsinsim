function parseHrtimeToSeconds(hrtime) {
    return parseFloat((hrtime[0] + (hrtime[1] / 1e9)));
}

class Interval {
    static all = [];
    static setInterval(name, callback, ms) {
        const interval = Interval.all.find(interval => interval.name === name);
        if(interval) {
            return console.log('[Interval] Failed to create! (Interval ' + interval.name + ' already exists)');
        }

        Interval.all.push({ name, id: setInterval(() => {
            const startTime = process.hrtime();
            callback();
            const endTime = process.hrtime(startTime);
            
            const int = Interval.all.find((interval) => name === interval.name);
            if(int) {
                const catched = parseHrtimeToSeconds(endTime);

                int.performance.any = true;

                // last
                int.performance.last = catched;

                // avg
                int.performance.avg.time += catched;
                int.performance.avg.times++;

                // max
                if(catched > int.performance.max) {
                    int.performance.max = catched;
                }

                // min
                if(catched < int.performance.min || int.performance.min === 0) {
                    int.performance.min = catched;
                }
            }
        }, ms), performance: {
            any: false,
            ms: ms, 
            last: 0, 
            avg: { times: 0, time: 0 },
            min: 0, max: 0,
        } });
    }
    static clearInterval(name) {
        const interval = Interval.all.find(interval => interval.name === name);
        if(interval) {
            clearInterval(interval.id);
            Interval.all = Interval.all.filter((interval_) => interval_ !== interval);
        }
    }
}

module.exports = Interval;