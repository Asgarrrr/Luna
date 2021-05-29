// ██████ Integrations █████████████████████████████████████████████████████████

// —— Terminal string styling done right
const chalk  = require( "chalk" )
// —— Glob implementation in JavaScript.
    , glob   = require( "glob" )
// —— Provides utilities for working with file and directory paths.
    , path   = require( "path" )
// —— Base structure
    , Event = require( "../Structures/Event" );

// ██████ | █████████████████████████████████████████████████████████████████████

class ready extends Event {

    constructor( client ) {
        super( client, {
            listener : true,
        });
    }

    async run() {

        // —— Load avalable Slash command
        for (const slash of glob.sync( "./Interactions/Slash/Create/*.js" )) {
            delete require.cache[ slash ];
            require ( path.resolve( slash ) )( this.client );
        }

        // —— List the answers
        for (const slash of glob.sync( "./Interactions/Slash/Effect/*.js" )) {
            delete require.cache[ slash ];
            const file = new ( require( path.resolve( slash ) ) )( this.client );

            this.client.slash.set( file.name, file );

        }


        for ( const modules of glob.sync( "./Modules/**/*.js" ) ) {

            delete require.cache[ modules ];
            require( path.resolve( modules ) )( this.client );

        }

        // —— A long sentence eh ...
        console.log( chalk.green( `\n ——— ${this.client.user.tag} : READY !` ) );

        if ( this.client.config.Presence ) {

            const { status, games, interval } = this.client.config.Presence;

            if ( games instanceof Array ) {

                // —— Set default presence
                this.client.user.setPresence({
                    status,
                    activity: {
                        name: games[0].name ? games[0].name : null,
                        type: games[0].type ? games[0].type : null,
                        url : games[0].url  ? games[0].url  : "https://www.twitch.tv/",
                    },
                });

                // —— Every x seconds, the activity (and its type) will change.
                setInterval(() => {
                    // —— Choose a random activity
                    const thisGame = games[parseInt( ~~( Math.random() * ( games.length ) ), 10 )];
                    // —— Redefined the bot's activity
                    this.client.user.setActivity( thisGame.name, {
                        type: thisGame.type,
                        url : thisGame.url || "https://www.twitch.tv/",
                    } );
                }, ( ( typeof interval === "number" && interval ) || 30 ) * 1000 );

            }

        }

    }

}

module.exports = ready;