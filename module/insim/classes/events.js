class EventsHandler {
    // private variables
    #Server;

    constructor(Server) {
        this.#Server = Server;
        this.events = [];
    }

    on(name, callback) {
        if(Array.isArray(name)) {
            for(const name_ of name) {
                this.events.push({ name: name_, callback: callback });
            }
        }
        else {
            this.events.push({ name: name, callback: callback });
        }
    }

    off(name) {
        for(const event of this.events) {
            if(event.name === name) {
                this.events.splice(this.events.indexOf(event), 1);
            }
        }
    }

    fire(name, ...args) {
        for(const event of this.events) {
            if(event.name === name) {
                event.callback(...args);
            }
        }
    }
}

module.exports = EventsHandler;