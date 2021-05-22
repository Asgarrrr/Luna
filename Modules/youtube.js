// ██████ Integrations █████████████████████████████████████████████████████████

// —— A small library for turning RSS XML feeds into JavaScript objects.
const Parser = require( "rss-parser" )
    , parser = new Parser();

// ██████ | ███████████████████████████████████████████████████████████████████

module.exports = async ( client ) => {

    void async function update () {

        try {

            // —— Retrieves all the information from the channels to be parsed
            const channels = await client.db.Notification.find( { } );

            // —— Retrieves RSS feeds from all channels
            const RSS = ( await Promise.all(
                channels.map( ( c ) => parser.parseURL( `https://www.youtube.com/feeds/videos.xml?channel_id=${ c.YBChannelID }` )
                    .catch( ( err ) => null )
                )
            ) ).filter( Boolean );

            for ( const [ i, channel ] of RSS.entries() ) {
                // —— Compares the date of the last item saved in the DB with the date of the last item in the RSS feed
                if ( new Date( channel.items[0].pubDate ) > new Date( channels[i].pubDate ) ) {

                    // —— Get the index of the last video sent
                    const newElements = channel.items.find( ( v ) => {
                        if ( new Date( v.pubDate ) < new Date( channels[i].pubDate ) )
                            return true;
                    });

                    /* —— Get an array of new videos, then reverse ( because the first one
                     *    is the most recent, but we want to send the oldest one first ) */
                    const toSend = channel.items.slice( 0, channel.items.indexOf( newElements ) ).reverse();

                    // —— For each subscribed guild
                    channels[ i ].guild.forEach( ( x ) => {

                        // —— And for each video
                        toSend.map( ( video ) => {

                            // —— Sending the message and the video in each guild to the corresponding channel
                            const guild     = client.guilds.cache.get( x._ID )
                                , local     = client.language[ guild.language || "EN" ].Modules.youtube
                                , channel   = guild.channels.cache.get( x._channelID );

                            channel.send( local.newVideo( channel.title ) );

                        });

                    })

                    // —— Save in the database the id and date of the last video
                    await client.db.Notification.findOneAndUpdate( {
                        YBChannelID : channels[ i ].YBChannelID
                    }, {
                        lastVideo   : toSend[ toSend.length - 1 ].id,
                        pubDate     : new Date( toSend[ toSend.length - 1 ].pubDate )
                    });

                }

            }


        } catch ( error ) {

            console.log( error )

            // —— Do nothing in case of errors for the moment

        } finally {

            // —— Repeat the check every minute
            await new Promise( ( r ) => setTimeout( r, 60000 ) );
            update();

        }

    }();

}