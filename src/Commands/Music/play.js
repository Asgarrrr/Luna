// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command = require("../../Base/Command");

const ytdl    = require("discord-ytdl-core"),
// —— Simple js only module to resolve YouTube playlist ids Doesn't need any login or GoogleAPI key
      ytpl    = require("ytpl"),
// —— Simple js only module to search YouTube Doesn't need any login or GoogleAPI key
      ytsr    = require("ytsr");

// —— Pattern regex ————————————————————————————————————————————————————————————

const validUrl = RegExp(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/);
const validYB  = RegExp(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/);
const validSC  = RegExp(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?(soundcloud\.com|snd\.sc)\/(.*)$/);

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

        const client = this.client;

        const url    = args[0],
              lang   = client.language.get("play"),
              query  = args.join(" "),
              player = message.guild.player;

         // —— Verifies if the user is connected to a voice channel
         if (!message.member.voice.channel)
            return super.respond("Glossary.NotInChan")

        // —— Join the user in his voice channel
        player._connection = await message.member.voice.channel.join()
            .catch(err => { return super.respond("Unable to join voice channel") })

        if(url.match(/^(?!.*\?.*\bv=)https:\/\/www\.youtube\.com\/.*\?.*\blist=.*$/))
            await this.addYbPlaylist(url, player);


        if(url.match(/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})?$/))
            await this.addYbVideo(url, player);

        // if(url.match(/(https?:\/\/open.spotify.com\/(track|user|artist|album)\/[a-zA-Z0-9]+(\/playlist\/[a-zA-Z0-9]+|)|spotify:(track|user|artist|album):[a-zA-Z0-9]+(:playlist:[a-zA-Z0-9]+|))/))
        //     this.addSfVideo(url, player);

        // if(url.match(/^https?:\/\/(soundcloud\.com|snd\.sc)\/(.*)$/))
        //     this.addScVideo(url, player);

        if(!url.match(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/))
            await this.search(query, player);

        if (!player._dispatcher) {
            this.play(player, message)
        }

    }

    destroy(player) {
        player._queue      = [];
        player._connection = null;
        player._dispatcher = null;
        player._isPlaying  = false;
        player._embed      = {};
        player._loop       = false;
    }

    play(player) {

        let stream = ytdl(player._queue[0].url, {
            filter: "audioonly",
            opusEncoded: true,
            highWaterMark: 1 << 25
        });

        player._dispatcher = player._connection.play(stream, {
            type: 'opus',
            bitrate: 'auto'
        })

        player._dispatcher.on('start', () => {
            if (Object.entries(player._embed).length === 0)
                this.createPlayer(player)
            else
                this.updatePlayer(player)

        })

        player._dispatcher.on('finish', () => this.finish(player))

    }

    finish(player) {

        if (player._queue.length > 0) {
            this.next()
        } else {
            this.destroy()
        }

    }

    next(player) {

        if (player._loop === true) {
            return this.play(player)
        }

        if (player._queue.length > 0 && player._loop === false) {
            player._queue.shift()
            return this.play(player)
        }

    }

    createPlayer(player){

        const vType = player._queue[0].duration === null
            ? "live"
            : player.queue[0].duration

        const progress = Array.from({length: (50 - (vType + 1))}, () => "─")

        console.log(progress);

        player._embed = {
            title  : player._queue[0].title,
            url    : player._queue[0].url,
            author : {
                name : player._queue[0].author.name,
                url  : player._queue[0].author.ref
            }
        }



        this.respond("ok")
        console.log("player");
    }

    async addYbVideo(url, player) {

        ytdl

    }

    async addYbPlaylist(url, player) {

        const playlist = await ytpl(url).catch(err => err)

        if (playlist instanceof Error)
            return super.respond("— Playlist error")

        const { items } = playlist

        for (let i = 0; i < items.length; i++) {
            player._queue.push({
                "id" : items[i].id,
                "url": items[i].url_simple,
                "title": items[i].title,
                "thumbnail": items[i].thumbnail,
                "duration": items[i].duration,
                "author": {
                    "name": items[i].author.name,
                    "ref": items[i].author.ref
                }
            })
        }
        return this
    }

}

module.exports = Play