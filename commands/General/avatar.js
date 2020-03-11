// ██████ Integrations █████████████████████████████████████████████████████████

// A powerful library for interacting with the Discord API
const { MessageEmbed } = require("discord.js");

// –––––– Parameters –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

module.exports = {

    name: "avatar",
    description: "Returns the profile picture of a mentioned user.",
    cooldown: 3,
    aliases: ["pp"],
    guildOnly: true,
    privileges: ["SEND_MESSAGES"],

    // –––––– Execution ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    async execute(Glossary, client, message, args) {

        // Remove the 'Request' message
        await message.delete();

        // Shortens the link to the user if it is pinged
        const IsPing = message.mentions.members.first(),
            // Retrieves the user's information if it is pinged, or search the username; otherwise use the applicant's information.
            ReqUser = (IsPing ? IsPing.user : client.users.cache.find((x) => x.username === args[0]) || message.member.user);
        // Generation of an embed to format and send the transmitted information
        message.channel.send(
            new MessageEmbed()
            .setColor("#36393f")
            .setAuthor(ReqUser === message.author ? `${Glossary.COM_Avatar[1]} ${ReqUser.username}` : `${Glossary.COM_Avatar[2]} ${ReqUser.username}, ${message.member.user.username}`, message.member.user.avatarURL())
            .setImage(ReqUser.avatarURL({
                format: 'png',
                dynamic: true,
                size: 1024
            }))
        ).then((reply) => {
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