// ██████ Integrations █████████████████████████████████████████████████████████

const ytdl    = require("discord-ytdl-core")
// —— Simple js only module to resolve YouTube playlist ids Doesn't need any login or GoogleAPI key.
    , ytpl    = require("ytpl")
// —— Simple js only module to search YouTube Doesn't need any login or GoogleAPI key.
    , ytsr    = require("ytsr")

    , { formatTime } = require("../../Structures/Util");


const chalk = require("chalk");

// —— Import base command
const Command = require("../../Structures/Command");

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

        const client = this.client
            , lang   = this.client.language.get("play")
            , player = message.guild.player

        // —— Verifies if the user is connected to a voice channel
        if (!message.member.voice.channel)
            return super.respond("You need to be a in voice channel");

        if (player._connection
            && !player._connection.voice.channel.members.has(message.author.id)
            && player._connection.voice.channel.members > 0 )
            return super.respond("Luna is already busy with other listeners, join her!");

        player._connection = await message.member.voice.channel.join()
            .catch((err) => { return super.respond("Unable to join voice channel"); });

        await this.handleQuery(args[0], player);

        if (!player._dispatcher)
            this.play(player);
    }

    async play(player) {

        console.log("———");

        let stream = ytdl(player._queue[0].url, {
            filter           : "audioonly",
            quality         : "highestaudio",
            opusEncoded     : true,
            highWaterMark   : 1024 * 1024 * 10
        });

        player._dispatcher = player._connection.play(stream, {
            type    : "opus",
            bitrate : "auto"
        });

        player._dispatcher.on("start", () => {
            console.log("_Dispatcher : Start");
        });

        player._dispatcher.on("finish", () => {

            if (player._queue.length >= 2) {

                !player._loop && player._oldQueue.unshift(player._queue.shift());

                this.play(player);

            } else {
                this.resetPlayer();
                this.message.guild.me.voice.channel.leave();
            }
        })
    }

    async handleQuery(query) {

        if (query.match(/^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/)) {

            if (query.match(/[&?]list=([^&]+)/i)) {

                const playlistID = await ytpl.getPlaylistID(query)
                    .catch(err => err);

                if (playlistID instanceof Error) {
                    if (playlistID.message === "Mixes not supported")
                        super.respond("Mixes not supported.");

                    return;
                }

                if (!ytpl.validateID(playlistID))
                    return super.respond("Invalide playlist")

                const playlist = await ytpl(playlistID, { limit: Infinity })
                    .catch(err => err);

                if (playlist instanceof Error)
                    return super.respond("The playlist does not exist.");

                let tTime = 0
                  , tLive = 0;

                for (const video of playlist.items) {
                    if (!video.isPlayable)
                        return
                    this.message.guild.player._queue.push({
                        title : video.title,
                        url : video.shortUrl,
                        thumbnail : video.bestThumbnail && video.bestThumbnail.url
                                    || video.thumbnails[0] &&  video.thumbnails[0].url,
                        author : {
                            url : video.author.url,
                            name : video.author.name
                        },
                        duration : video.durationSec || "live"
                    });

                    if (video.isLive === true)
                        tLive++
                    else
                        tTime += video.durationSec
                }

                super.respond({embed: {
                    title : playlist.title,
                    url : playlist.url,
                    description: `<@${this.message.author.id}> added ${playlist.estimatedItemCount} elements to the track. ( ${formatTime(tTime)} ${tLive > 0 ? `& ${tLive} Live` : ""} )`
                }})

            } else {
                getYoutubeVideo()

            }
        }
    }

    resetPlayer() {
        this.message.guild.player = {
            _queue       : [],
            _oldQueue    : [],
            _connection  : null,
            _dispatcher  : null,
            _isPlaying   : false,
            _volume      : 1,
            _embed       : {},
            _loop        : false,
            _ttl         : [0, 0],
        };
    }
}

module.exports = Play;