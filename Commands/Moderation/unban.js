// —— Import base command
const Command = require("../../Structures/Command");

const { resolveUser } = require("../../Structures/Util");

class Unban extends Command {

    constructor(client) {
        super(client, {
            name        : "unban",
            description : "unban",
            usage       : "unban @user",
            args        : true,
            category    : "Moderation",
            cooldown    : 5000,
            permLevel   : 9,
            userPerms   : "BAN_MEMBERS",
            allowDMs    : true,
        });
    }

    async run(message, [user]) {

        const client = this.client,
              lang   = client.language.get(message.guild.local).unban();

        // —— Try to retrieve an ID against a mention, a username or an ID
        const target = await resolveUser(user, client);

        if(!target)
            return super.respond(lang[0]);

        if (target.id === message.author.id)
            return super.respond(lang[1]);

        if (target.id === this.client.user.id)
            return super.respond(lang[2]);

        const banlist = await message.guild.fetchBans();

        if(!banlist.find((b) => b.user.id === target.id))
            return super.respond(lang[3]);

        message.guild.members.unban(target)
        .then((data) => {

             (client.config.logchan
                ? message.guild.channels.cache.get(client.config.logchan)
                : message.channel).send({
                "embed": {
                    color : "008000",
                    author: {
                        name: lang[4],
                    },
                    title: `${data.username}#${data.discriminator} \`${data.id}\``,
                    fields: [{
                        name: lang[5],
                        value: `${message.author.username}#${message.author.discriminator} \`${message.author.id}\``,
                    }],
                },
            });
        })
        .catch(() => super.respond(lang[6]));

    }
}

module.exports = Unban;