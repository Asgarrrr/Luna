class Event {

	constructor( client, options = {} ) {

        this.client     = client;
		this.name       = options.name || this.constructor.name;
		this.listener   = options.once ? "once" : "on";

	}

	async run( ...args ) {
		throw new Error( `The run method has not been implemented in ${this.name}` );
	}

}

module.exports = Event;