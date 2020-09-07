// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command = require("../Command");

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
            allowDMs    : true
        });
    }

    async run(message, args) {

        const client  = this.client,
              url     = args[0];

        // —— Verifies if the user is connected to a voice channel
         if (!message.member.voice.channel)
             return message.channel.send("Glossary.NotInChan")

        // —— Retrieve guild player
        const guildPlayer =
            client.player.get(message.guild.id)
            || client.player.set(message.guild.id, {
                queue      : [],
                connection : null,
                dispatcher : null
            })
            && client.player.get(message.guild.id);


        if (validUrl.test(url)) {

            // —— If the URL passed matches that of a playlist
            if (url.match(/^(?!.*\?.*\bv=)https:\/\/www\.youtube\.com\/.*\?.*\blist=.*$/)) {



            }


        } else {

        }





        if (validUrl.test(url)) {

            if (validYB.test(url)) {

                if (url.includes("list=")) {

                    const playlist = await ytpl(url).catch(err => err)

                    if (playlist instanceof Error)
                        return this.respond("Playlist Error")





                }

                console.log("1");

            }

            console.log("2");

        } else {
            console.log("not valid url");
        }
    }
}

module.exports = Play