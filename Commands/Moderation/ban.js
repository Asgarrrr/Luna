// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
    const Command = require( "../../Structures/Command" );

// ██████ | ███████████████████████████████████████████████████████████████████

// —— Create & export a class for the command that extends the base command
class Avatar extends Command {

    constructor( client ) {
        super( client, {
            name        : "ban",
            description : "Ban a user",
            usage       : "ban @mention { Reason } ",
            exemple     : ["@Asgarrrr", "Luna"],
            args        : true,
            category    : "Moderation",
            cooldown    : 1000,
            userPerms   : "BAN_MEMBERS",
            guildOnly   : true,
        } );
    }

    async run( message, [ mention, ...reason ] ) {

        // —— Try to retrieve an ID against a mention, or an ID.
        const target = await this.client.utils.resolveMention( parseInt( mention ) ? `<@${mention}>` : mention , message.guild, 1 );

        if( !target )
            return super.respond( this.language.noTarget );

        if ( target.id === message.author.id )
            return super.respond( this.language.yourself );

        if ( target.id === this.client.user.id )
            return super.respond( this.language.notMe );

        if ( message.member.ownerID !== message.author.id
            && target.roles.highest.position >= message.member.roles.highest.position )
            return super.respond( this.language.higher );

        if ( !target.bannable )
            return super.respond( this.language.notBannable );

        try {

            // —— Banning the user, including the reason
            message.guild.members.ban( target, {
                reason : `${reason.length ? reason.join( " " ) : null }\n> — <@${message.author.id}>`
            } );

        } catch ( error ) {

            super.respond( this.language.error );

        }

    }
}

module.exports = Avatar;