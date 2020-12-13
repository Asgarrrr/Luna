// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command = require("../../Structures/Command");

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
        const lang = client.language.get(message.guild.local).language();
        // —— Sending the request message
        const selector = await super.respond({ embed : {
            description : lang[0]
        }});
        // —— React with available country flags
        const flag = client.language.map((x) => selector.react(x.flag) && x.flag);
        // —— Create a filter so that only the applicant and the available flags are processed
        const filter = (reaction, user) => flag.includes(reaction.emoji.name) && user.id === message.author.id;
        // —— Awaits language selection for one minute
        const collected = await selector.awaitReactions(filter, { max: 1, time: 60000 });
        // —— Selects the language according to the emoji
        const index = flag.indexOf(collected.first().emoji.name);
        // —— Changing the language and saving in the database
        message.guild.local = Array.from(client.language.keys())[parseInt(index, 10)];
        await this.client.db.prepare("UPDATE Guilds SET Local = ? WHERE _ID = ?").run(message.guild.local, message.guild.id);
        // —— Deleting the message and sending the confirmation
        selector.delete({ reason: "Command completed." });

        super.respond(client.language.get(message.guild.local).language()[1]);

    }
}

module.exports = Language;