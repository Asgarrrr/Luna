// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command = require( "../../Structures/Command" );

// ██████ | ███████████████████████████████████████████████████████████████████

// —— Create & export a class for the command that extends the base command
class Loop extends Command {

	constructor( client ) {
		super( client, {
			name        : "loop",
			description : "The current track will repeat itself indefinitely ",
			usage       : "loop",
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

        // —— Reverses in the player its loop state
        player._loop = !player._loop;

        // —— If the player is present
        if ( player._embedMsg && player._embedMsg.components[0] ) {

            try {

                // —— Change player button
                const loopBtn = player._embedMsg.components[0].components[4];

                loopBtn.style = player._loop ? 1 : 2;
                loopBtn.emoji.name = player._loop ? "🔁" : "🔂";

                // —— Modifies the original message
                await player._embedMsg.edit( { embed: player._embed(), component: player._embedMsg.components[0] } );

            } catch ( error ) {

                super.respond( player._loop ? this.language.enabled : this.language.disabled );

            }

        } else super.respond( player._loop ? this.language.enabled : this.language.disabled );

    }

}

module.exports = Loop;