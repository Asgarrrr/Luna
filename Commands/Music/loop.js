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
        if ( player._embedMsg ) {

            // —— Display or not the new state
            player._embedMsg.embeds[0].footer = {
                text : player._loop ? language.loop : ""
            };

            // —— Modifies the original message
            player._embedMsg.edit( player._embedMsg.embeds[0] );

        } else super.respond( player._loop ? this.language.enabled : this.language.disabled );

    }

}

module.exports = Loop;