// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command   = require( "../../Structures/Command" )
// —— A light-weight module that brings window.fetch to Node.js
    , fetch     = require( "node-fetch" )
// —— Tiny, fast, and elegant implemsentation of core jQuery designed specifically for the server
    , cheerio   = require( "cheerio" );

// ██████ | ███████████████████████████████████████████████████████████████████

// —— Create & export a class for the command that extends the base command
class subYoutube extends Command {

    constructor( client ) {
        super( client, {
            name        : "subyoutube",
            description : "Adds the channel to the subscription list, and defines the channel in which the new videos will be sent ",
            usage       : "subyoutube [ Youtube channel URL ]",
            args        : true,
            category    : "Moderation",
            cooldown    : 1000,
            userPerms   : "MANAGE_GUILD",
            guildOnly   : true,
        } );
    }

    async run( message, [ url ] ) {

        // —— Checks that the url is conform to the url of a youtube channel
        const validURL = url.match( /((?:http(?:s)?)|(?:www)?)?youtu(?:(?:\.be)|(?:be\..{2,3}))\/(?:(?:user)|(?:channel)|c\/)/ );

        if ( !validURL )
            return super.respond( this.language.invalid );

        try {

            // —— Retrieve the code of the web page
            const body      = await fetch( url ).then( ( res ) => res.text() )
            // —— Loading HTML document
                , $         =  cheerio.load( body )
            // —— Get the url of the channel, the name, the profile picture url, and the channel ID
                , channel   = $( "body" ).find( "link").attr( "href" )
                , name      = $( "body" ).find( "meta[property='og:title']" ).attr( "content" )
                , avatar    = $( "body" ).find( "link[rel='image_src']" ).attr( "href" )
                , channelID = channel.substring( channel.lastIndexOf( "/" ) + 1 );

            // —— Adds guild information
            await this.client.db.Notification.findOneAndUpdate({
                YBChannelID: channelID,
            }, {
                $addToSet: {
                    guild: {
                        _ID: this.message.guild.id,
                        _channelID: this.message.channel.id
                    }
                },
            }, {
                upsert: true,
                setDefaultsOnInsert: true
            });

            // —— Delete the base message
            message.delete().catch ( ( err ) => err );

            super.respond( { embed : {
                author: {
                    name,
                    icon_url : avatar
                },
                title   : this.language.done,
                url     : channel,
                description: this.language.information( name ),
            }});

        } catch ( error ) {

            super.respond ( this.language.error );

        }

    }
}

module.exports = subYoutube;