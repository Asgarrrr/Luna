// ██████ Integrations █████████████████████████████████████████████████████████

// —— Base structure
const Event = require( "../../Structures/Event" );

// ██████ | █████████████████████████████████████████████████████████████████████

// —— Create & export a class for the event that extends the base event
class guildBanAdd extends Event {

    constructor( client ) {
        super( client );
    }

    async run( guild, user ) {

        const { guildBanAdd: language } = this.client.language[ guild.local ];

        try {

            const data = await guild.fetchAuditLogs({
                limit   : 1,
                type    : "MEMBER_BAN_ADD",
            });

            // —— Selects the first result
            const banned = data.entries.first();

            // —— Sending a confirmation message if this option is activated
            if ( guild.plugins.logger.enabled ) {

                // —— Get the chosen channel
                const channel = guild.channels.cache.get( guild.plugins.logger.channel );

                // —— Sending a confirmation message
                channel && channel.send( { embed : {
                    title       : "Utilisateur banni",
                    color       : "#f04747",
                    timestamp   : Date.now(),
                    // —— Let's do a consistency check here and make sure we got something.
                    description : banned ? language.details( banned ) : language.missDetails( user )
                }});

            }

        } catch (error) {

            console.error(error);

        }

    }

}

module.exports = guildBanAdd;