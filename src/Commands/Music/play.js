// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command = require("../../Structures/Command");

// —— A ytdl-core wrapper focused on efficiency for use in Discord music bots.
const ytdl    = require("discord-ytdl-core"),
// —— Simple js only module to resolve YouTube playlist ids Doesn't need any login or GoogleAPI key.
      ytpl    = require("ytpl"),
// —— Simple js only module to search YouTube Doesn't need any login or GoogleAPI key.
      ytsr    = require("ytsr");

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

        console.log(player._queue);

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

    }

    // —— Resolve YouTube playlist —————————————————————————————————————————————
    async addYbPlaylist(player, url) {

            const playlist = await ytpl(url, { limit: Infinity }).catch((err) => {
                return super.respond("It seems that this playlist cannot be imported.")
            });

            let ttlTime = 0,
                ttlLive = 0;

            playlist.items = playlist.items.filter((videos) => videos.title !== "[Private video]" && videos.title !== "[Deleted video]" );

            playlist.items.map((video) => {

                let duration = video.duration !== null ? video.duration.split(':').reverse().reduce((prev, curr, i) => prev + curr * Math.pow(60, i), 0) : "live";

                if ( typeof duration === 'number' )
                    ttlTime += duration;
                else
                    ttlLive++;

                player._queue.push({
                    "id" : video.id,
                    "url": video.url_simple,
                    "title": video.title,
                    "thumbnail": video.thumbnail,
                    "duration": [video.duration, duration],
                    "author": {
                        "name": video.author.name,
                        "ref": video.author.ref
                    }
                })
            })

            super.respond({embed: {
                author : {
                    name: `${playlist.items.length} elements added to the queue`,
                },
                title: playlist.title,
                url: playlist.url,
                thumbnail : {
                    url : `https://i.ytimg.com/vi/${playlist.items[0].id}/mqdefault.jpg`
                },
                fields : {
                    name: "Total length :",
                    value: `${new Date(ttlTime * 1000).toISOString().substr(11, 8)} ${ttlLive > 0 && `& ${ttlLive} Lives` || ""}`
                }
            }});

    }

    async addYbVideo(player, url) {

        const { videoDetails } = await ytdl.getBasicInfo(
            url.searchParams.get("v")
        );

        player._queue.push({
            url     : videoDetails.video_url,
            title   : videoDetails.title,
            author  : {
                name     : videoDetails.author.name,
                url      : videoDetails.author.user_url,
                avatar   : videoDetails.author.avatar
            },
            media   : {
                song    : videoDetails.media.song,
                artist  : videoDetails.media.artist,
                album   : videoDetails.media.album
            },
            length  : videoDetails.lengthSeconds
        })

    }

}

module.exports = Play;