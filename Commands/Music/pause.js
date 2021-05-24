// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command = require( "../../Structures/Command" );

// ██████ | ███████████████████████████████████████████████████████████████████

// —— Create & export a class for the command that extends the base command
class Pause extends Command {

	constructor( client ) {
		super( client, {
			name        : "pause",
			description : "Pause or resume playback",
			usage       : "pause",
			args        : false,
			category    : "Music",
			cooldown    : 1000,
            aliases     : ["resume"],
			userPerms   : "CONNECT",
			allowDMs    : false,
		});

	}

    async run( message ) {

        const player = message.guild.player;

        // —— Checks that the user meets the conditions for executing the command
        if ( this.client.utils.checkVoice( player, message, this.language ) !== 0 )
            return;

        // —— Reverses in the player its reading state
        player._isPlaying = !player._isPlaying;

        // —— Switch between play and pause
        player._isPlaying === true
            ? player._dispatcher.pause( true )
            : player._dispatcher.resume();

    }

}

module.exports = Pause;