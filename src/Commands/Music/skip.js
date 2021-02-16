// —— Import base command
const Command = require("../../Structures/Command");

class Skip extends Command {
    constructor(client) {
        super(client, {
            name: "skip",
            description: "Jumps directly to the next item in the playlist. If this is the last music, the bot will go away..",
            usage: "skip",
            args: false,
            category: "Music",
            cooldown: 1000,
            userPerms: "CONNECT",
            clientPerms: ["CONNECT", "SPEAK"],
            allowDMs: false,
        });
    }

    run(message) {

        const lang   = this.client.language.get(message.guild.local).skip()
            , player = message.guild.player;

        // —— Verifies if the user is connected to a voice channel
        if (!message.member.voice.channel)
            return super.respond(lang[0]);

        // —— Check if Luna is connected to a voice channel
        if (!player._connection)
            return super.respond(lang[1]);

        // —— Check if the user and Luna are on the same voice channel
        if (!player._connection.voice.channel.members.has(message.author.id))
            return super.respond(lang[2]);

        player._dispatcher.end();

    }

}

module.exports = Skip;