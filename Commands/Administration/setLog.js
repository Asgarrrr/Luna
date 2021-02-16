// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command = require("../../Structures/Command");

// ██████ | ███████████████████████████████████████████████████████████ | ██████

// —— Create & export a class for the command that extends the base command
class Language extends Command {

    constructor(client) {
        super(client, {
            name        : "setlog",
            description : "Defined the log room",
            exemple     : [],
            args        : false,
            category    : "Administration",
            cooldown    : 0,
            permLevel   : 9,
            userPerms   : "ADMINISTRATOR",
            allowDMs    : false,
        });

    }

    async run(message, [channel]) {

        // —— Retrieve the language information for this command
        const lang = this.client.language.get(message.guild.local).setlog();

        channel = await this.client.resolveChannel(channel, message.guild) || message.channel;

        if (!channel)
            return super.respond(lang[0]);

        try {
            // —— Changing the logChan and saving in the database
            message.guild.logChan = channel.id;
            await this.client.db.prepare("UPDATE Guilds SET logChan = ? WHERE _ID = ?").run(channel.id, message.guild.id);

        } catch (error) {

            console.log(error);
            return super.respond(lang[1]);

        }

        message.guild.channels.cache.get(message.guild.logChan).send(lang[2]);

    }
}

module.exports = Language;