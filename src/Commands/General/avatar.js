
/* › Commands / avatar.js ——————————————————————————————————————————————————————

   — Returns the profile image of a player, present or not in the guild.
     Targeting by mention, username, or ID                                    */

// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command = require("../Command"),
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

        // —— In private, only the ID can be used.
        if (message.channel.type === "dm" && !(parseInt(args[0], 10) && args[0].length === 18))
            return message.channel.send(client.language.get("avatar", 0)[0]);

        // —— Try to retrieve an ID against a mention, a username or an ID, if nothing is found, use author's ID
        const userId =
            parseInt(args[0], 10) && args[0].length === 18 ? args[0] : NaN
            || args[0] && args[0].replace(/\D/g,"") !== "" ? args[0] = args[0].replace(/\D/g,"") : NaN
            || client.users.cache.find((x) => x.username === args[0]) && client.users.cache.find((x) => x.username === args[0]).id
            || message.member.user.id;

        // —— Retrieve a user's information through the API
        const userData =
            await fetch(`https://discord.com/api/users/${userId}`, {
                headers: { "Authorization": `Bot ${client.config.token}`}
            }).then((res) => res.json());

        // —— Retrieve the language information for this command
        const lang = client.language.get("avatar", userData)

        try {
            super.respond({ embed: {
                description: message.author.id === userData.id ? lang[1] : lang[2],
                image: {
                    url: `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.${userData.avatar.substring(0, 2) === "a_" ? "gif" : "png"}?size=4096`,
                }
            }});
        } catch {
            super.respond(lang[3]);
        }
    }
}

module.exports = Avatar;