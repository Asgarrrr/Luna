
// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command = require("../../Base/Command");

// ██████ | ███████████████████████████████████████████████████████████ | ██████

// —— Create & export a class for the command that extends the base command
class Language extends Command {

    constructor(client) {
        super(client, {
            name        : "language",
            description : "Change the language used by Luna in the guild",
            usage       : "£language",
            exemple     : [],
            args        : false,
            category    : "Administration",
            cooldown    : 10000,
            aliases     : ["sl"],
            permLevel   : 9,
            permission  : "ADMINISTRATOR",
            allowDMs    : false
        });

    }

    async run(message, args) {

        const client = this.client;

        // —— Retrieve the language information for this command
        const lang = client.language.get(message.guild.local).language()

        const selector = await super.respond({embed : {
            description : lang[0]
        }});

        ["🇬🇧", "🇫🇷"].forEach((e) => selector.react(e));

        const filter = (reaction, user) => {
            return ["🇬🇧", "🇫🇷"].includes(reaction.emoji.name) && user.id === message.author.id;
        };

        const collected = await selector.awaitReactions(filter, { max: 1, time: 60000 });

        switch (collected.first().emoji.name) {

            case "🇬🇧":
                message.guild.local = "English";
                await this.client.db.prepare('UPDATE Guilds SET Local = ? WHERE _ID = ?').run(0, message.guild.id);
                break;

            case "🇫🇷":
                message.guild.local = "French";
                await this.client.db.prepare('UPDATE Guilds SET Local = ? WHERE _ID = ?').run(1, message.guild.id);
                break;

            default:
                break;
        }

        selector.delete({ reason: 'Command completed.' });
        super.respond(client.language.get(message.guild.local).language()[1]);

    }
}

module.exports = Language;