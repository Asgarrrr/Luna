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

        const client  = this.client,
              url     = args[0];

        let player = message.guild.player

        // —— Verifies if the user is connected to a voice channel
        if (!message.member.voice.channel)
            return message.channel.send("Glossary.NotInChan")

        player.connection = await message.member.voice.channel.join()
            .catch(err => { return super.respond("Unable to join voice channel") })

        if (validUrl.test(url)) {

            // —— If the URL passed matches that of a playlist
            if (url.match(/^(?!.*\?.*\bv=)https:\/\/www\.youtube\.com\/.*\?.*\blist=.*$/)) {

                const playlist = await ytpl(url).catch(err => err)

                if (playlist instanceof Error)
                    return super.respond("— Playlist error")

                const { items } = playlist

                for (let i = 0; i < items.length; i++) {
                    player.queue.push(
                        {
                            "id" : items[i].id,
                            "url": items[i].url_simple,
                            "title": items[i].title,
                            "thumbnail": items[i].thumbnail,
                            "duration": items[i].duration,
                            "author": {
                              "name": items[i].author.name,
                              "ref": items[i].author.ref
                            }
                        }
                    )
                }
            }

        } else {

        }

        if (!player.dispatcher) {
            this.play(player, message)
        }


    }

    play(player) {

        if (Object.entries(player.embed).length === 0) { }

        let stream = ytdl(player.queue[0].url, {
            filter: "audioonly",
            opusEncoded: true,
            highWaterMark: 1 << 25
        });

        player.dispatcher = player.connection.play(stream, {
            type: 'opus',
            bitrate: 'auto'
        })

        player.dispatcher.on('start', () => {

        })

    }

    finish() {

    }

}

module.exports = Play