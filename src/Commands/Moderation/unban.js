// —— Import base command
const Command = require("../../Base/Command");

class Unban extends Command {

    constructor(client) {
        super(client, {
            name        : "unban",
            description : "unban a user",
            usage       : "unban @user reason",
            args        : true,
            category    : "Moderation",
            cooldown    : 5000,
            permLevel   : 9,
            permission  : "BAN_MEMBERS",
            allowDMs    : true
        });
    }

    async run(message, args) {

        const client = this.client,
              lang   = client.language.get("unban");

        // —— Try to retrieve an ID against a mention, a username or an ID
        const target = await client.resolveUser(args[0])

        if(!target)
            return super.respond("You need to choice user");

        const banlist = await message.guild.fetchBans();

        if(!banlist.find((b) => b.user.id === target.id))
            return super.respond("not find")

        message.guild.members.unban(target).catch(() => {
            super.respond("user not unaban")
        });

    }
}

module.exports = Unban;