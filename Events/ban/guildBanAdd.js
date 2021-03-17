// ██████ Integrations █████████████████████████████████████████████████████████

// —— Base structure
const Event = require( "../../Structures/Event" );

// ██████ | █████████████████████████████████████████████████████████████████████

class guildBanAdd extends Event {

    constructor( client ) {
        super( client );
    }

    async run( guild, user ) {

        try {

            const data = await guild.fetchAuditLogs({
                limit   : 1,
                type    : "MEMBER_BAN_ADD",
                user
            });

            if (!data.entries)
                return "Mhhhh";

            console.log(data.entries)

        } catch (error) {
            console.log(error);
        }




    }


}

module.exports = guildBanAdd;