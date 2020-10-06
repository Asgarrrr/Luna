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

        const URL    = args[0],
              lang   = this.client.language.get("play"),
              query  = args.join(" "),
              player = message.guild.player;

        console.log(URL);

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

        // —— Youtube Playlist
        if(url.match(/^.*(youtu.be\/|list=)([^#\&\?]*).*/))
            await this.addYbPlaylist(player, url);

        // —— Youtube Video
        if(url.match(/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})?$/))
            await this.addYbVideo(url, player);

        // —— Sondcloud
        if(url.match(/^https?:\/\/(soundcloud\.com|snd\.sc)\/(.*)$/))
            await this.addScVideo(url, player);

        // —— Spotify
        if(url.match(/.*?spotify\.com\/track\/(\w+\?\w+=\w+)\s/))
            await this.addSfVideo(url, player);

        // —— No url, or not supported
        if(!url.match(/^?:http(s)?:\/\/(-\.)?([^\s\/?\.#]+\.?)+(\/[^\s]*)?$/i))
            await this.search(query, player);

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
            log
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

        let ttl = [0, 0];

        const playlist = await ytpl(url, { limit: Infinity }).catch((err) => {
            return super.respond("It seems that this playlist cannot be imported.");
        });

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