class Event {
    static all = [];

    static on(name, callback, topPriority = false) {
        if(Array.isArray(name)) {
            for(const key of name) {
                Event.all.push({ name: key, callback, topPriority });
            }
        }
        else {
            Event.all.push({ name, callback, topPriority });
        }
    }

    static off(name) {
        Event.all = Event.all.filter((event) => event.name !== name);
    }

    static fire(name, ...args) {
        var response = [];
        const events = Event.all.filter((event) => event.name === name).sort((a, b) => Number(b.topPriority) - Number(a.topPriority));
        for(const event of events) {
            response.push(event.callback(...args));
        }

        return response;
    }
}

module.exports = Event;