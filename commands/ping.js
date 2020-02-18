// ██████ Integrations █████████████████████████████████████████████████████████

const { RichEmbed } = require("discord.js");

var pingacc = [];

// –––––– Parameters –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

module.exports = {

    name            : "ping",
    description     : "Sends test packets to the bot, and measures the response time.",
    cooldown        : 5,
    aliases         : [],
    guildOnly       : false,
    privileges      : "@everyone",

// –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    async execute(client, message) {

        const Ping  = await message.channel.send("Ping ..."),
              Lat   = new Date().getTime() - Ping.createdTimestamp;

        await Ping.delete();

        const embed = new RichEmbed()
            .setAuthor("`( •_•)O´¯`*.¸.·´¯`°Q(•_• )`")
            .setColor("#7354f6")
            .setDescription([
                    "```",
                    "  Latency │ " + Lat + "ms",
                    "Websocket │ " + Math.round(client.ping) + "ms",
                    "```"
                ].join("\n"))
            .setFooter(`Command executed by @${message.author.username}`);

        pingacc.push(Lat);

        // Send the embed, and after that ...
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
};