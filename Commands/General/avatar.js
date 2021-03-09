// ██████ Integrations █████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API
const { GuildMember }   = require("discord.js")
// —— Import base command
    , Command           = require("../../Structures/Command");

// ██████ | ███████████████████████████████████████████████████████████████████

// —— Create & export a class for the command that extends the base command
class Avatar extends Command {

    constructor(client) {
        super(client, {
            name        : "avatar",
            description : "Returns the profile image of a player. Targeting by mention, username, or ID",
            usage       : "avatar {@mention || username || ID}",
            exemple     : ["662331369392832512", "@Luna", "Luna"],
            args        : false,
            category    : "General",
            cooldown    : 1000,
            aliases     : ["pp"],
            userPerms   : "SEND_MESSAGES",
            allowDMs    : true,
        });
    }

    async run(message, [ target ]) {

        // —— If the user uses an id, transforms it into a mention
        target = parseInt(target) ? `<@${target}>` : target

        // —— Try to retrieve an ID against a mention, a username or an ID, if nothing is found, use author's ID
        let user = await this.client.utils.resolveMention( ( target || `<@${message.author.id}>` ), this.client, 1 );

        if ( !user )
            return super.respond( "Unable to retrieve user information" );

        user = user instanceof GuildMember ? user.user : user;

        super.respond({ embed: {
            description: `**This is ${message.author.id === user.id ? `your avatar, <@${user.id}>**` : `the profile picture of <@${user.id}>**`}`,
            image: {
                url: user.displayAvatarURL({ dynamic: true, size: 4096 }),
            },
        } });

    }
}

module.exports = Avatar;