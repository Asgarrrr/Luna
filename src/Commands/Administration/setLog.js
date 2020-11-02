// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command = require("../../Base/Command");

// ██████ | ███████████████████████████████████████████████████████████ | ██████

// —— Create & export a class for the command that extends the base command
class Language extends Command {

    constructor(client) {
        super(client, {
            name        : "setlog",
            description : "defined the log room",
            exemple     : [],
            args        : false,
            category    : "Administration",
            cooldown    : 0,
            aliases     : [],
            permLevel   : 9,
            permission  : "ADMINISTRATOR",
            allowDMs    : false
        });

    }

    async run(message, [channel]) {

        const client = this.client;
        // —— Retrieve the language information for this command
        const lang = client.language.get(message.guild.local).setlog();


        if (channel) {
            channel = await client.resolveChannel(channel)
            if (!channel)
                return super.respond(lang[0])
        } else {
            channel = message.channel
        }

        try {
            // —— Changing the logChan and saving in the database
            message.guild.logChan = channel.id
            await this.client.db.prepare('UPDATE Guilds SET logChan = ? WHERE _ID = ?').run(channel.id, message.guild.id);

        } catch (error) {

            console.log(error);
            return super.respond(lang[1])

        }

        message.guild.channels.cache.get(message.guild.logChan).send(lang[2])

    }
}

module.exports = Language;