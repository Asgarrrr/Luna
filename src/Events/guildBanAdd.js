// ██████ Initialization ███████████████████████████████████████████████████████

class guildBanAdd {

    constructor(client) {

        this.client = client;
    }

    async run(guild) {

        const client = this.client;

        const data = await guild.fetchAuditLogs({
            limit: 1,
            type: "MEMBER_BAN_ADD",
        });

        const ban  = data.entries.first(),
              lang = client.language.get(guild.local).guildBanAdd();

        ban.executor.id !== client.user.id
        && guild.logchan
        && guild.channels.cache.get(guild.logchan).send({
            "embed": {
                color: 15158332,
                title: `${ban.target.username}#${ban.target.discriminator} \`${ban.target.id}\``,
                author: {
                    name: lang[0],
                },
                fields: [{
                    name: lang[1],
                    value: ban.reason || lang[2],
                }, {
                    name: lang[3],
                    value: `${ban.executor.username}#${ban.executor.discriminator} \`${ban.executor.id}\``,
                }]
            }
        });

        if (client.db.prepare("SELECT 1 FROM Members WHERE _ID = ? LIMIT 1").get(`${guild.id}-${ban.target.id}`))
            client.createUser(guild, ban.target);

        client.db.prepare("UPDATE Members SET Ban = 1 WHERE _ID = ?").run(`${guild.id}-${ban.target.id}`);

    }
}

module.exports = guildBanAdd;