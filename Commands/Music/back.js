// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command = require( "../../Structures/Command" );

// ██████ | ███████████████████████████████████████████████████████████████████

// —— Create & export a class for the command that extends the base command
class Back extends Command {

	constructor( client ) {
		super( client, {
			name        : "back",
			description : "Goes back to the previous track.",
			usage       : "back { Number of elements to back }",
			args        : false,
			category    : "Music",
			cooldown    : 1000,
			userPerms   : "CONNECT",
			allowDMs    : false,
		});

	}

    async run( message, amount = 1 ) {

        const player = message.guild.player;

        // —— Checks that the user meets the conditions for executing the command
        if ( this.client.utils.checkVoice( player, message, this.language ) !== 0 )
            return;

        let votes = 0;

        if ( !player._oldQueue.length )
            return super.respond( this.language.nothingBack );

        const getHalf = () => ~~( ( player._connection.voice.channel.members.size - 1 ) / 2 );

        // —— If only one person's vote is required, there is no need to request confirmation
        if ( getHalf() > 1 ) {

            const confirm = await super.respond( { embed: {
                description: this.language.wantBack( message.author ),
                footer : {
                    text: `${ votes } / ${ getHalf() }`
                }
            }} );

            await confirm.react( "👍" );

            // —— Creates a reaction collector.
            const collector = confirm.createReactionCollector( ( r, u ) => r.emoji.name === "👍" && player._connection && player._connection.channel.members.has( u.id ), {
                dispose : true,
                time    : 60000,
                errors  : ["time"]
            } );

            collector.on( "collect", ( ) => {

                confirm.embeds[0].footer.text = `${ ++votes } / ${ getHalf() }`;
                confirm.edit( confirm.embeds[0] );

                if ( votes === getHalf() ) {

                    // —— Deletes the most recent old track and adds it to the list of tracks to play
                    player._queue.unshift( ...player._oldQueue.splice( 0, 1 + amount ).reverse() );
                    player._dispatcher.end();

                    collector.stop( true );

                }

            });

            collector.on( "remove", ( ) => {

                confirm.embeds[0].footer.text = `${ --votes } / ${ getHalf() }`;
                confirm.edit( confirm.embeds[0] );

            });

            collector.on( "end", ( collected, reason ) => {

                // —— Removes all reactions
                confirm.reactions.removeAll();

                confirm.embeds[0].footer.text = "";
                confirm.embeds[0].description = reason === true
                    ? this.language.majVoted
                    : this.language.majNotVoted;

                confirm.edit( confirm.embeds[0] );
                // —— Delete the message after 20 seconds
                setTimeout( () => confirm.delete().catch( ( err ) => err ), 20000 );

            });

        } else {

            // —— Deletes the most recent old track and adds it to the list of tracks to play
            player._queue.unshift( ...player._oldQueue.splice( 0, 2 + amount ).reverse() );
            player._dispatcher.end();

        }

    }

}

module.exports = Back;