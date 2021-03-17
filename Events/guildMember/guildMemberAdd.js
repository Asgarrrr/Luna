// ██████ Integrations █████████████████████████████████████████████████████████

// —— Base structure
const Event = require( "../../Structures/Event" );

// ██████ | █████████████████████████████████████████████████████████████████████

class guildMemberAdd extends Event {

    constructor( client ) {
        super( client );
    }

    async run( member ) {

        // —— Automatic role assignment
        const { plugins: { autorole }} = await this.client.db.Guild.findOne( {_ID: member.guild.id}, "plugins.autorole" );

        const { enabled, roles } = autorole;

        if ( enabled && roles.length ) {

            const toSet = await Promise.all( roles.map( ( role ) => member.guild.roles.fetch( role ) ) );

            member.roles.add( toSet );

        }


    }


}

module.exports = guildMemberAdd;