// ██████ Integrations █████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API.
const Discord = require( "discord.js" );

// ██████ | ███████████████████████████████████████████████████████████████████

module.exports = class Utils {

    constructor(client) {

        this.client = client;

    }

    /** Extract the related object out of a Discord mention
      * @param      { String }                      query   Mention.
      * @param      { Discord.(Client | Guild) }    from    Specifies whether you want to retrieve this information from the client or the guild.
      * @param      { Number }                      type    What you want to extract | 0 = All, 1 = User, 2 = Role, 3 = Channel
      * @returns    { Object|undefined }                    An object with a "member", "role" or "channel" property corresponding to the mention, or "null" if the provided channel is not a mention
      */
    async resolveMention(query, from, type = 0) {

        if ( typeof query !== "string" )
            throw new TypeError( "Invalid string provided." );

        if ( from && !( from instanceof Discord.Guild || from instanceof Discord.Client ) )
            throw new TypeError( "Invalid source provided." );

        if ( type < 0 || type > 3)
            throw new TypeError( "The type goes from 0 to 3." );

        const filter = `^<(${[ "@!?|@&|#", "@!?", "@&", "#" ][type]})([0-9]+)>`

            , match  = query.match( new RegExp( filter ) );

        if ( !match )
            return;

        const prefix = match[1]
            , id     = match[2];

        if ( prefix === "@&" && from instanceof Discord.Client )
            throw new TypeError( "Roles only exist in a guild" );

        switch (prefix) {

            case "@":
            case "@!":

                const type = from instanceof Discord.Client ? "users" : "members";
                return await from[ type ].fetch( match[2] ).catch( () => {} );

            case "@&":  return await from.roles.cache.get( id );

            case "#":   return await from.channels.cache.get( id ).then( ( x ) => x );

        }

    }

    /** Converts a certain number of seconds to formatted time hh:mm:ss
     * @param {number} seconds // Name of second to convert
     */
    formatTime( seconds ) {
        const h = Math.floor( seconds / 3600 )
            , m = Math.floor( ( seconds % 3600) / 60 )
            , s = Math.round( seconds % 60 );

        return [
            h,
            m > 9 ? m : ( h ? "0" + m : m || "0" ),
            s > 9 ? s : "0" + s,
        ].filter( Boolean ).join( ":" );
    }

    checkVoice( player, message, lang ) {
        // —— Verifies if the user is connected to a voice channel
        if (!message.member.voice.channel)
            return message.channel.send( lang.notInVoice );

        // —— Check if Luna is connected to a voice channel
        if ( !player._connection || !player._dispatcher )
            return message.channel.send( lang.noConnected );

        // —— Check if the user and Luna are on the same voice channel
        if ( !player._connection.voice.channel.members.has( message.author.id ) )
            return message.channel.send( lang.busy );

        return 0;
    }

    * chunks( arr, n ) {
        for ( let i = 0; i < arr.length; i += n ) {
            yield arr.slice(i, i + n);
        }
    }

};