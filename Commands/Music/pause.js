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

        // —— Switch between play and pause
        player._isPlaying === true
            ? player._dispatcher.pause( true )
            : player._dispatcher.resume();

        // —— Reverses in the player its reading state
        player._isPlaying = !player._isPlaying;

        if ( player._embedMsg && player._embedMsg.components[0] ) {

            try {

                // —— Change player button
                const pauseBtn = player._embedMsg.components[0].components[2];

                pauseBtn.emoji.name = player._isPlaying ? "⏸️" : "▶️";

                // —— Modifies the original message
                await player._embedMsg.edit( { component: player._embedMsg.components[0] } );

            } catch ( error ) { }

        }

    }

}

module.exports = Pause;