// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command = require( "../../Structures/Command" );

// ██████ | ███████████████████████████████████████████████████████████████████

// —— Create & export a class for the command that extends the base command
class Back extends Command {

	constructor( client ) {
		super( client, {
			name        : "back",
			description : "Re-read the previous track",
			usage       : "back { quantity }",
			args        : false,
			category    : "Music",
			cooldown    : 1000,
			userPerms   : "CONNECT",
			allowDMs    : false,
		});

	}

    async run( message ) {

        const player = message.guild.player;

        // —— Checks that the user meets the conditions for executing the command
        if ( this.client.utils.checkVoice( player, message, this.language ) !== 0 )
            return;

        // —— Deletes the most recent old track and adds it to the list of tracks to play
        player._queue.unshift( ...player._oldQueue.splice( 0, 2 ).reverse() );
        player._dispatcher.end();

    }

}

module.exports = Back;