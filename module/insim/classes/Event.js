class Event {
    static all = [];

    on(name, callback) {
        if(Array.isArray(name)) {
            for(const key of name) {
                Event.all.push({ name: key, callback });
            }
        }
        else {
            Event.all.push({ name, callback });
        }
    }

    off(name) {
        Event.all = Event.all.filter((event) => event.name !== name);
    }

    fire(name, ...args) {
        var response = [];
        const events = Event.all.filter((event) => event.name === name);
        for(const event of events) {
            response.push(event.callback(...args));
        }

        return response;
    }
}

module.exports = new Event;