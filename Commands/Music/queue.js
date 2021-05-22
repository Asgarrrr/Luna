// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command = require( "../../Structures/Command" );

// ██████ | ███████████████████████████████████████████████████████████████████

// —— Create & export a class for the command that extends the base command
class Queue extends Command {

	constructor( client ) {
		super( client, {
			name        : "queue",
			description : "Indicates the content of the queue",
			usage       : "queue",
			args        : false,
			category    : "Music",
			cooldown    : 1000,
			userPerms   : "SEND_MESSAGES",
			allowDMs    : false,
		});

	}

    async run( message ) {

        const player = message.guild.player;

        if ( !player._queue.length )
            return super.respond( { embed : {

                title : this.language.empty,
                description : this.language.emptyDesc( message.guild.prefix ),
                thumbnail : {
                    url : "https://media.tenor.com/images/3470a1094fcb299e2b4caba0668fc660/tenor.gif",
                }

            }} );

        // —— Calculation of total time
        const queueTime = player._queue.reduce( ( sum, { length } ) => sum + length , 0);

        const pages = [];
        let counter = 0;

        const { chunks, formatTime } = this.client.utils;

        // —— Cut the queue 10 by 10
        [ ...chunks( player._queue, 10 ) ].forEach( ( group, page, all ) => {

            // —— Calculation of the maximum length of the character string
            const timeLength = Math.max( ...( group.map( ( el ) => ( el.live ? "Live" : formatTime( el.length ).length ) ) ) );

            pages[ page ] = {

                title       : `${ this.language.queueName( message.guild.name ) } ( \`${  player._queue.length }\` )`,
                description : `\`\`\`apache\n${ group.map( ( track, index ) => {

                        const line = [
                            `${ group.length * page + index + 1 }`.padStart( 3 ),
                            `${ track.live ? "Live" : formatTime( track.length ) }`.padEnd( timeLength ),
                            `${ track.title }`
                        ].join( " │ " );

                        return line.length > 64 ? line.substring( 0, 47 ) + "…" : line;

                    }).join( "\n" ) } \`\`\`\`\`\`Total : ${ formatTime( queueTime ) }\`\`\``,

                footer      : {
                    text : `${ page + 1 } / ${ all.length }`
                },
                color       : "0x7354f6",
            };

        });

        const pagination = await super.respond( { embed : pages[0] } )
            , reactions  = [ "⬆️", "⬇️", "🔍" ];

        reactions.forEach( ( r ) => pagination.react( r ) );

        pagination.createReactionCollector(
            ( r, u ) => reactions.includes( r.emoji.name ) && u.id !== pagination.author.id,
            { time: 600000 }
        ).on( "collect", async ( r, u ) => {

            if ( r.emoji.name === "⬆️" && counter > 0 )
                pagination.edit( { embed : pages[ --counter ] } );

            if ( r.emoji.name === "⬇️" && counter < Object.keys( pages ).length - 1 )
                pagination.edit( { embed : pages[ ++counter ] } );

            if ( r.emoji.name === "🔍" ) {

                const demand = await super.respond( this.language.page );

                message.channel.createMessageCollector(
                    ( m ) => m.author.id == u.id && parseInt( m.content ) > 0 && parseInt(m.content) < Object.keys( pages ).length + 1,
                    { time: 15000, max: 1, errors: ["time"] },
                ).on( "collect", ( m ) => {

                    m.delete();
                    pagination.edit( { embed : pages[ counter = parseInt( m.content ) - 1 ] } );

                }).on( "end", () => demand.delete().catch( ( err ) => err ) );

            }

            // —— Delete the reaction just added by the user
            r.users.remove( u.id );

        });

    }

}

module.exports = Queue;