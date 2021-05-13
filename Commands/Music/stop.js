// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command = require( "../../Structures/Command" );

// ██████ | ███████████████████████████████████████████████████████████████████

// —— Create & export a class for the command that extends the base command
class Stop extends Command {

	constructor( client ) {
		super( client, {
			name        : "stop",
			description : "Clear the playlist and disconnect Luna",
			usage       : "stop",
			args        : false,
			category    : "Music",
			cooldown    : 1000,
			userPerms   : "CONNECT",
			allowDMs    : false,
		} );

	}

    async run( message ) {

        const player = message.guild.player;

        // —— Checks that the user meets the conditions for executing the command
        if ( this.client.utils.checkVoice( player, message, this.language ) !== 0 )
            return;

        // —— Clear and emit the end request.
        player._queue.length = 0;
        player._dispatcher.end();


    }

}

module.exports = Stop;