// ██████ Integrations █████████████████████████████████████████████████████████

// A powerful library for interacting with the Discord API
const Discord  = require("discord.js");

// ––––––––––– | –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

module.exports = {

    /**
    * –– DelAfterSend : Send embed and add a reaction to be able to remove it.
    * @param {object} client  : The Discord client
    * @param {object} message : The Discord message
    * @param {object} message : The MessageEmbed object
    */

    DelAfterSend(client, message, embed) {

        message.channel.send(embed).then((reply) => {
            // ... Adds a "trash" reaction
            reply.react("🗑");
            // Creation of a filter that only takes in consideration the trash emoji and ignores that added by the bot
            const filter = (reaction, user) => reaction.emoji.name === "🗑" && user.id !== client.user.id;
            // Create a "reaction collector" using the filter, with a maximum of 1
            reply.createReactionCollector(filter, {
                    maxMatches: 1
                })
                // Removes the embed when a new reaction is received.
                .on("collect", () => reply.delete());
        });

    }
}