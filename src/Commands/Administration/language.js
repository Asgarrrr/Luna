
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


        const test = await super.respond({embed : {
            title : lang[0]
        }});

        ["🇬🇧", "🇫🇷"].forEach(e => test.react(e))


        const english = (reaction, user) => {
            return reaction.emoji.name === '🇬🇧' && user.id === message.author.id;
        };

        const french = (reaction, user) => {
            return reaction.emoji.name === '🇫🇷' && user.id === message.author.id;
        };

        const collector = message.createReactionCollector({ time: 15000 });

        collector.on('collect', (reaction, user) => {
            console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
        });







    }
}

module.exports = Language;