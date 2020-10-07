// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command = require("../../Base/Command");

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

            let clearUrl = new URL(url);

            switch (clearUrl.hostname) {

                case "www.youtube.com":

                    clearUrl.searchParams.get("list")
                    && await this.addYbPlaylist(player, url);

                    clearUrl.searchParams.get("v")
                    && await this.addYbVideo(player, url);

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
            this.search(query, player);
        }

        if (!player._dispatcher)
            this.play(player);
    }


    // —— Play method ——————————————————————————————————————————————————————————
    play(player) {

        if (Object.entries(player._embed).length === 0)
            this.createPlayer(player);

        let stream = ytdl(player._queue[0].url, {
            filter           : "audioonly",
            quality         : "highestaudio",
            opusEncoded     : true,
            highWaterMark   : 1 << 25
        });

        player._dispatcher = player._connection.play(stream, {
            type: 'opus',
            bitrate: 'auto'
        });

        player._dispatcher.on('start', () => {
            console.log("_Dispatcher : Start");
        });

        player._dispatcher.on('finish', () => {

            if (player._loop === true)
                return this.play(player);

            if (player._queue.length > 0 && player._loop === false) {
                player._queue.shift();
                return this.play(player);
            }

            if (player._queue.length === 0)
                return this.destroy();
        });

    }

    async next(player, manual = false) {

        if( manual === true ) {
            player._queue > 0
                ? player._queue.shift(player) && this.play(player)
                : this.destroy(player);
        } else {
            if (player._loop === true) {
                this.play(player);
            } else {
                player._queue > 0
                    ? player._queue.shift(player) && this.play(player)
                    : this.destroy(player);
            }
        }
    }

    // —— Resolve YouTube playlist —————————————————————————————————————————————
    async addYbPlaylist(player, url) {

        const playlist = await ytpl(url, { limit: Infinity }).catch((err) => {
            return super.respond("It seems that this playlist cannot be imported.");
        });

        playlist.items
        .filter((v) => (["[Private video]", "[Deleted video]"].includes(v.title)))
        .map(  (v) => {

            let duration = video.duration !== null
                ? video.duration.split(':').reverse().reduce((prev, curr, i) => prev + curr * Math.pow(60, i), 0)
                : "live";

            if ( typeof duration === 'number' )
                player._ttl[0] += duration;
            else
                player._ttl[1] ++;

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
            });
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

    async createPlayer(player) {

        const now = player._queue[0];

        player._embed = {
            title : now.title
        };

        super.respond({embed: player._embed});
    }

    destroy(player) {
        player.queue      = [];
        player.connection = null;
        player.dispatcher = null;
        player.isPlaying  = false;
        player.embed      = {};
    }
}

module.exports = Play;