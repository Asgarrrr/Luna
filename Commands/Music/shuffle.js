// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command = require( "../../Structures/Command" );

// ██████ | ███████████████████████████████████████████████████████████████████

// —— Create & export a class for the command that extends the base command
class Shuffle extends Command {

	constructor( client ) {
		super( client, {
			name        : "shuffle",
			description : "Randomly shuffle the playlist.",
			usage       : "shuffle",
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

        if ( player._queue.length < 2 )
            return super.respond( this.language.tooFew );

        // —— Fisher-Yates algorith
        for ( let i = player._queue.length - 1; i > 0; i-- ) {
            const j = ~~( Math.random() * ( i + 1 ) )
                , temp = player._queue[i];
            player._queue[i] = player._queue[j];
            player._queue[j] = temp;
        }

        super.respond( this.language.shuffled );

    }

}

module.exports = Shuffle;