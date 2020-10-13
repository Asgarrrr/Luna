// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command = require("../../Base/Command");

// —— A ytdl-core wrapper focused on efficiency for use in Discord music bots.
const ytdl    = require("discord-ytdl-core"),
// —— Simple js only module to resolve YouTube playlist ids Doesn't need any login or GoogleAPI key.
      ytpl    = require("ytpl"),
// —— Simple js only module to search YouTube Doesn't need any login or GoogleAPI key.
      ytsr    = require("ytsr");

      const fs = require("fs");

// ██████ | ███████████████████████████████████████████████████████████ | ██████

// —— Create a class for the command that extends the base command
class Play extends Command {

    constructor(client) {
        super(client, {
            name        : "play",
            description : "If you are in a voice room, call the bot to play a music from a supported url.",
            usage       : "play https://www.youtube.com/watch?v=5qap5aO4i9A",
            exemple     : [],
            args        : true,
            category    : "Music",
            cooldown    : 1000,
            aliases     : ["p"],
            permLevel   : 0,
            permission  : "READ_MESSAGES",
            clientPerms : ["CONNECT", "SPEAK"],
            allowDMs    : true
        });
    }

    async run(message, args) {

        console.log("—— Command start");

        const url    = args[0],
              lang   = this.client.language.get("play"),
              query  = args.join(" "),
              player = message.guild.player;

        // —— Verifies if the user is connected to a voice channel
        if (!message.member.voice.channel)
            return super.respond("You need to be a in voice channel");

        // —— Verifies that Luna is not already occupied
        if (player._connection
            && !player._connection.voice.channel.members.has(message.author.id)
            && player._connection.voice.channel.members > 0 )
            return super.respond("Luna is already busy with other listeners, join her!");

        // —— Join the user in his voice channel
        player._connection = await message.member.voice.channel.join()
        .catch((err) => { return super.respond("Unable to join voice channel"); });

        try {

            let validUrl = new URL(url);

            console.log(validUrl);

            switch (validUrl.hostname) {

                case "www.youtube.com":

                    validUrl.searchParams.get("list")
                    && await this.addYbPlaylist(player, validUrl);

                    validUrl.searchParams.get("v")
                    && await this.addYbVideo(player, validUrl);

                    break;

                case "soundcloud.com":
                    console.log("soundcloud is not yet supported");
                    break;

                case "open.spotify.com":
                    console.log("spotify is not yet supported");
                    break;

                default:
                    this.search(query, player);
                    break;
            }

        } catch (err) {
            console.log(err);
            this.search(query, player);
        }

        if (!player._dispatcher)
            this.play(player);
    }

    play(player) {

        let stream = ytdl(player._queue[0].url, {
            filter           : "audioonly",
            quality         : "highestaudio",
            opusEncoded     : true,
            highWaterMark   : 1 << 25
        });

        player._dispatcher = player._connection.play(stream, {
            type    : 'opus',
            bitrate : 'auto'
        });

        player._dispatcher.on('start', () => {


            console.log("_Dispatcher : Start");
        });

        player._dispatcher.on('finish', () => {
            console.log("_Dispatcher : Finish");
        })

        player._dispatcher.on('info', (info, format) => {
            if (!format.url) {
                console.log(info.video_id, format);
            }
        });

    }

    async addYbVideo(player, url) {

        const videoId   = url.searchParams.get("v");

        const { videoDetails } = await ytdl.getBasicInfo(videoId);

        //console.log(videoDetails);

        player._queue.push({
            url : url.href
        })


        console.log(player._queue);


    }

}

module.exports = Play;