// ██████ Initialization ███████████████████████████████████████████████████████

class guildMemberAdd {

    constructor(client) {

        this.client = client;
    }

    async run(member) {

        const client = this.client;

        if (member.user.bot)
            return;

        if (client.config.welcomeMsg === true) {

            try {
                const toChannel =
                    client.config.welcomeMsgChannel
                    || member.guild.systemChannelID
                    || member.guild.channels.cache.find(channel => channel.permissionsFor(member.guild.me).has("SEND_MESSAGES"));

                client.channels.cache.get(toChannel).send("test");

            } catch (error) {

            }
        }
    }
}

module.exports = guildMemberAdd;