// ██████ Integrations █████████████████████████████████████████████████████████

// A powerful library for interacting with the Discord API
const Discord  = require("discord.js");

// ––––––––––– | –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

module.exports = {

    /**
    * –– DelAfterSend ––––––– : Send embed and add a reaction to be able to remove it.
    * @param {object} client  : The Discord client
    * @param {object} message : The Discord message
    * @param {object} embed   : The MessageEmbed object
    * @param {object} emoji   : The emoji that will be used
    */

    delAfterSend(client, message, embed, emoji) {

        message.channel.send(embed).then((reply) => {
            // ... Adds a "trash" reaction
            reply.react(emoji);
            // Creation of a filter that only takes in consideration the trash emoji and ignores that added by the bot
            const filter = (reaction, user) => reaction.emoji.name === emoji && user.id !== client.user.id;
            // Create a "reaction collector" using the filter, with a maximum of 1
            reply.createReactionCollector(filter, {
                    maxMatches: 1
                })
                // Removes the embed when a new reaction is received.
                .on("collect", () => reply.delete());
        });
    }
};