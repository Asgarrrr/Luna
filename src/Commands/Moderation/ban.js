// —— Import base command
const Command = require("../../Structures/Command");

class Ban extends Command {

    constructor(client) {
        super(client, {
            name        : "ban",
            description : "Ban a user",
            usage       : "ban @user [reason]",
            args        : true,
            category    : "Moderation",
            cooldown    : 5000,
            permLevel   : 9,
            permission  : "BAN_MEMBERS",
            allowDMs    : true
        });
    }

    async run(message, [user, ...reason]) {

        const client = this.client,
              lang   = client.language.get(message.guild.local).ban();

        // —— Try to retrieve an ID against a mention, a username or an ID
        const target = await client.resolveUser(user, message.guild);

        if(!target)
            return super.respond(lang[0]);

        if (target.id === message.author.id)
            return super.respond(lang[1]);

        if (target.id === this.client.user.id)
            return super.respond(lang[2]);

        if ( message.member.ownerID !== message.author.id
            && target.roles.highest.position >= message.member.roles.highest.position )
            return super.respond(lang[3]);

        if (!target.bannable)
            return super.respond(lang[4]);

        reason = reason ? reason.join(" ") : null;

        message.guild.members.ban(target, { reason })
        .then((data) => {

            message.guild.logchan
            && message.guild.channels.cache.get(message.guild.logchan).send({
                "embed": {
                    color: 15158332,
                    title: `${data.username}#${data.discriminator} \`${data.id}\``,
                    author: {
                        name: lang[5],
                    },
                    fields: [{
                        name: lang[6],
                        value: reason || lang[7],
                    }, {
                        name: lang[8],
                        value: `${message.author.username}#${message.author.discriminator} \`${message.author.id}\``,
                    }]
                }
            })

        })
        .catch((err) => {
            super.respond(lang[6])
        });

    }
}

module.exports = Ban;