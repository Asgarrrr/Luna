// ██████ Integrations █████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API
const { GuildMember }   = require( "discord.js" )
// —— Import base command
    , Command           = require( "../../Structures/Command" );

// ██████ | ███████████████████████████████████████████████████████████████████

// —— Create & export a class for the command that extends the base command
class Avatar extends Command {

    constructor( client ) {
        super( client, {
            name        : "avatar",
            description : "Returns the profile picture of a member.",
            usage       : "avatar {member / member ID }",
            example     : ["662331369392832512", "@Luna", "Luna"],
            args        : false,
            category    : "General",
            cooldown    : 1000,
            aliases     : ["pp"],
            userPerms   : "SEND_MESSAGES",
            guildOnly   : false,
        } );
    }

    async run( message, [ target ] ) {

        // —— If the user uses an id, transforms it into a mention
        target = parseInt( target ) ? `<@${target}>` : target;

        // —— Try to retrieve an ID against a mention, a username or an ID, if nothing is found, use author's ID
        let user = await this.client.utils.resolveMention( ( target || `<@${message.author.id}>` ), this.client, 1 );

        if ( !user )
            return super.respond( this.language.noUserInformation );

        user = user instanceof GuildMember ? user.user : user;

        super.respond({ embed: {
            description : `${this.language.thisIs} ${message.author.id === user.id ? this.language.userIsAuthor( user ) : this.language.userAvatar( user ) }`,
            image       : {
                url     : user.displayAvatarURL({ dynamic: true, size: 4096 }),
            },
        } });

    }
}

module.exports = Avatar;