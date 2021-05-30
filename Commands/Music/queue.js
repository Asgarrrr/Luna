// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command           = require( "../../Structures/Command" )
// —— A fast and easy API to create a buttons in discord using discord.js
    , { MessageButton } = require( "discord-buttons" );

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

                title       : this.language.empty,
                description : this.language.emptyDesc( message.guild.prefix ),
                thumbnail   : {
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

        const buttons = [ "⬆️", "⬇️", "🔍" ].map( ( i ) => new MessageButton().setLabel( "" ).setID( i ).setStyle( "gray" ).setEmoji( i ) );

        const position = () => {
            buttons[0].disabled = counter === 0 ? true : false;
            buttons[1].disabled = counter === Object.keys( pages ).length - 1 ?  true : false;
        };

        position();

        const pagination = await super.respond( { embed : pages[0], buttons } );

        pagination.createButtonCollector(
            () => true , { time: 100 }
        ).on( "collect", async ( b ) => {

            if ( b.id === "🔍" ) {

                const demand = await super.respond( this.language.page );

                buttons[2].disabled = true;

                message.channel.createMessageCollector(
                    ( m ) => m.author.id === b.clicker.user.id && parseInt( m.content ) > 0 && parseInt( m.content ) < Object.keys( pages ).length + 1,
                    { time: 15000, max: 1, errors: [ "time" ] },
                ).on( "collect", async ( m ) => {

                    await m.delete();
                    counter = ( parseInt( m.content ) - 1 );
                    position();
                    await pagination.edit( { embed : pages[ counter ], buttons } );

                }).on( "end", () => {

                    demand.delete().catch( ( err ) => err );
                    buttons[2].disabled = false;
                    pagination.edit( { embed : pages[ counter ], buttons } );

                });

            }

            if ( b.id === "⬆️" && counter > 0 )
                --counter;

            if ( b.id === "⬇️"  && counter < Object.keys( pages ).length - 1 )
                ++counter;

            position();

            await pagination.edit( { embed : pages[ counter ], buttons } );
            // —— Confirms the interaction
            await b.defer();

        }).on( "end", () => {

            // —— Disable all buttons
            buttons.map( ( b ) => b.disabled = true );

            pagination.edit( { embed : pages[ counter ], buttons } );

        });

    }

}

module.exports = Queue;