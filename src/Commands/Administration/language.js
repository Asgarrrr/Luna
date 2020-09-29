
// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command = require("../../Base/Command");

// ██████ | ███████████████████████████████████████████████████████████ | ██████

const query = this.client.db.prepare('UPDATE Guilds SET(?) WHERE _ID = ?')

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
            permission  : "",
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

        ["🇬🇧", "🇫🇷"].forEach(e => selector.react(e))

        const filter = (reaction, user) => {
            return ["🇬🇧", "🇫🇷"].includes(reaction.emoji.name) && user.id === message.author.id;
        };

        selector.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
            .then(collected => {

                switch (collected.first().emoji.name) {

                    case "🇬🇧":
                        message.guild.local = "English";
                        query.run(0, message.guild)
                        break;

                    case "🇫🇷":
                        message.guild.local = "French";
                        query.run(1, message.guild)
                        break;

                    default:
                        break;
                }

                super.respond(
                    client.language.get(message.guild.local).language()[1]
                )

            })


    }
}

module.exports = Language;