const Discord = require("discord.js")

module.exports = class Utils {

    constructor(client) {

        this.client = client

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

        const match = query.match( new RegExp( `^<(${[ "@!?|@&|#", "@!?", "@&", "#" ][type]})([0-9]+)>$` ) );

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
                break;

            case "@&": {

                return await from.roles.cache.get( id )
                break;
            }

            case "#":
                return await from.channels.cache.get( id ).then( x => x);
                break;

        }


    }

}