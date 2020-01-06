// ██████ Integrations █████████████████████████████████████████████████████████

const { RichEmbed } = require("discord.js");

// –––––– Parameters –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

module.exports = {

    name: "ping",
    description: "Sends test packets to the bot, and measures the response time.",
    cooldown: 0.1,
    aliases: [],
    guildOnly: false,
    privileges: "@everyone",

    // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    async execute(client, message) {

        const Ping = await message.channel.send("Ping ...");
        await Ping.delete();

        const embed = new RichEmbed()
            .setAuthor("`( •_•)O´¯`*.¸.·´¯`°Q(•_• )`")
            .setColor("#7354f6")
            .setDescription(
                ["```",
                    "  Latency │ " + (new Date().getTime() - Ping.createdTimestamp) + "ms",
                    "Websocket │ " + Math.round(client.ping) + "ms",
                    "```"].join('\n'))
            .setFooter(`Command executed by @${message.author.username}`);

        message.channel.send(embed).then(reply => {                               // Send the embed, and after that ...
            reply.react("🗑");                                                      // ... Adds a "trash" reaction
            // Creation of a filter that only takes in consideration the trash emoji and ignores that added by the bot
            const filter = (reaction, user) => reaction.emoji.name === "🗑" && user.id !== client.user.id;
            reply.createReactionCollector(filter, {                                  // Create a "reaction collector" using the filter, with a maximum of 1
                maxMatches: 1
            })
                .on("collect", () => reply.delete());                                 // Removes the embed when a new reaction is received.
        });
    }
};
