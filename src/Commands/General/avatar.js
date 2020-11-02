
/* › Commands / avatar.js ——————————————————————————————————————————————————————

   — Returns the profile image of a player, present or not in the guild.
     Targeting by mention, username, or ID                                    */

// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command = require("../../Base/Command"),
// —— A light-weight module that brings window.fetch to node.js
      fetch   = require("node-fetch");

// ██████ | ███████████████████████████████████████████████████████████ | ██████

// —— Create & export a class for the command that extends the base command
class Avatar extends Command {

    constructor(client) {
        super(client, {
            name        : "avatar",
            description : "Returns the profile image of a player.\n> Targeting by mention, username, or ID",
            usage       : "avatar {@mention || username || ID}",
            exemple     : ["662331369392832512", "@Luna", "Luna"],
            args        : false,
            category    : "General",
            cooldown    : 1000,
            aliases     : ["pp"],
            permLevel   : 0,
            permission  : "READ_MESSAGES",
            allowDMs    : true
        });
    }

    async run(message, args) {

        const client = this.client;

        // —— Try to retrieve an ID against a mention, a username or an ID, if nothing is found, use author's ID
        const user = await client.resolveUser(args[0]) || message.author;

        // —— Retrieve the language information for this command
        const lang = client.language.get(message.guild && message.guild.local || "English").avatar(user);

        super.respond({ embed: {
            description: message.author.id === user.id ? lang[1] : lang[2],
            image: {
                url: user.displayAvatarURL({dynamic: true, size: 4096})
            }
        }});

    }
}

module.exports = Avatar;