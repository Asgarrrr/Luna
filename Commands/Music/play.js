// ██████ Integrations █████████████████████████████████████████████████████████

// —— Simple ytdl wrapper for discord bots with custom ffmpeg args support.
const ytdl    = require("discord-ytdl-core")
// —— Simple js only module to resolve YouTube playlist ids Doesn't need any login or GoogleAPI key.
    , ytpl    = require("ytpl")
// —— Simple js only module to search YouTube Doesn't need any login or GoogleAPI key.
    , ytsr    = require("ytsr")

    , { formatTime } = require("../../Structures/Util");

// —— Import base command
const Command = require("../../Structures/Command");

class Play extends Command {
    constructor(client) {
        super(client, {
            name        : "play",
            description : "If you are in a voice room, call the bot to play a music from a supported url.",
            usage       : "play https://www.youtube.com/watch?v=5qap5aO4i9A",
            args        : true,
            category    : "Music",
            cooldown    : 1000,
            aliases     : ["p"],
            permLevel   : 0,
            permission  : "CONNECT",
            clientPerms : ["CONNECT", "SPEAK"],
            allowDMs    : false,
        });
    }

    async run(message, args) {

        const player = message.guild.player
            , query  = args.join(" ");

        // —— Verifies if the user is connected to a voice channel
        if (!message.member.voice.channel)
            return super.respond("You need to be a in voice channel");

        // —— Checks if Luna and the user are in the same channel
        if (player._connection
            && !player._connection.voice.channel.members.has(message.author.id)
            && player._connection.voice.channel.members > 0)
            return super.respond("Luna is already busy with other listeners, join her!");

        // —— Connecting to a voice channel
        player._connection = await message.member.voice.channel.join()
            .catch(() => { return super.respond("Unable to join voice channel"); });

        // —— Handle different URLs / input requests
        await this.handleQuery(query, player);

        // —— If a dispatcher has not been created and an element is available in the queue, create it
        if (!player._dispatcher && player._queue.length > 0)
            this.play(player);

    }

    async play(player) {

        // —— Attempts to download a video from the given url. Returns a readable stream.
        const stream = ytdl(player._queue[0].url, {
            filter          : "audioonly",
            quality         : "highestaudio",
            opusEncoded     : true,
            highWaterMark   : 1024 * 1024 * 10,
        });

        // —— Play an audio ReadableStream.
        player._dispatcher = player._connection.play(stream, {
            type        : "opus",
            bitrate     : "auto",
            dlChunkSize : 0,
        });

        // —— When a new item begins to play
        player._dispatcher.on("start", () => {

        });

        // —— When a item end to play
        player._dispatcher.on("finish", () => {

            // —— If there are still items to play at the end of the current item, and the repeat mode is not enabled, the item is removed from the queue and goes into the "queue history".
            if (player._queue.length > 1) {

                !player._loop && player._oldQueue.unshift(player._queue.shift());
                this.play(player);

            } else {

                this.resetPlayer();
                this.message.guild.me.voice.channel.leave();

            }
        });
    }

    async handleQuery(query) {

        // —— If the url matches that of YouTube ...
        if (query.match(/^(http|https)?(:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)/)) {
            // —— ... and it corresponds to a playlist
            if (query.match(/[&?]list=([^&]+)/i))
                return await this.youtubePlaylist(query);
            else
                // —— or a video
                return await this.youtubeVideo(query);

        }

        await this.search(query);
    }

    async youtubePlaylist(query) {

        // —— Retrieve the playlist ID
        const playlistID = await ytpl.getPlaylistID(query)
            .catch((err) => err);

        // —— If the playlist is not valid (or if it is a mix)
        if (playlistID instanceof Error)
            if (playlistID.message === "Mixes not supported")
                return super.respond("Mixes not supported.");
        else
            return super.respond("Unable to get this playlist");

        // —— Verifies if the playlist exists
        if (!ytpl.validateID(playlistID))
            return super.respond("Invalide playlist");

        // —— Get the X videos of the playlist
        const playlist = await ytpl(playlistID, { limit: Infinity })
            .catch((err) => err);

        if (playlist instanceof Error)
            return super.respond("The playlist does not exist.");

        let tTime = 0
          , tLive = 0;

        for (const video of playlist.items) {

            if (!video.isPlayable)
                return;

            this.message.guild.player._queue.push({
                id : video.id,
                url : video.shortUrl,
                type: "Youtube",
                title : video.title,
                thumbnail : video.bestThumbnail && video.bestThumbnail.url || video.thumbnails[0] && video.thumbnails[0].url,
                author : {
                    url : video.author.url,
                    name : video.author.name,
                },
                duration : video.durationSec || "live",
            });

            if (video.isLive === true)
                tLive++;
            else
                tTime += video.durationSec;
        }

        return super.respond({ embed: {
            title : playlist.title,
            url : playlist.url,
            description: `<@${this.message.author.id}> added ${playlist.estimatedItemCount} elements to the track. ( ${formatTime(tTime)} ${tLive > 0 ? `& ${tLive} Live` : ""} )`,
        } });
    }

    async youtubeVideo(query) {

        // —— If the video is not a playlist
        const { videoDetails } = await ytdl.getBasicInfo(query)
            .catch((err) => err);

        if (!videoDetails)
            return super.respond("The video does not exist.");

        const videoLength = parseInt(videoDetails.lengthSeconds, 10);

        this.message.guild.player._queue.push({
            id : videoDetails.videoId,
            url : videoDetails.video_url,
            type: "Youtube",
            title : videoDetails.title,
            thumbnail : `https://i.ytimg.com/vi_webp/${videoDetails.videoId}/maxresdefault.webp`,
            author : {
                url : videoDetails.author.channel_url,
                name : videoDetails.author.name,
            },
            duration : videoLength || "live",
        });

        return super.respond({ embed: {
            title : videoDetails.title,
            url : videoDetails.video_url,
            description: `<@${this.message.author.id}> added an elements to the track. ( ${ formatTime(videoLength) || "Live" } )`,
        } });

    }

    async search(query) {

        let fQuery = await ytsr.getFilters(query);
            fQuery = fQuery.get("Type").get("Video");

        const { items } = await ytsr(fQuery.url, { limit: 10 });

        const found = items.map((x, i) => {

            return [
                (++i).toString().padStart(2).padEnd(3),
                (x.duration || "Live").padEnd(9),
                x.title.length >= 48 ? x.title.substring(0, 47) + "…" : x.title,
            ].join("| ");

        });

        found.push("exit");

        const result = await this.message.channel.send("```" + found.join("\n") + "```");

        const filter = (selector) => (selector.content > 0 && selector.content < found.length) || selector.content === "exit";

        const collected = await this.message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ["time"] })
            .catch(() => { return result.delete({ timeout: 0}); });

        let toAdd = collected.first().content;

        if (toAdd === "exit")
            return result.delete({ timeout: 0});

        toAdd = items[toAdd--];

        this.message.guild.player._queue.push({
            id: toAdd.id,
            url: toAdd.url,
            type: "Youtube",
            title: toAdd.title,
            thumbnail: toAdd.bestThumbnail && toAdd.bestThumbnail.url
                        || toAdd.thumbnails[0] && toAdd.thumbnails[0].url,
            author : {
                url : toAdd.author.url,
                name : toAdd.author.name,
            },
            duration : toAdd.durationSec || "live",
        });
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