
const ytdl    = require("discord-ytdl-core"),
// —— Simple js only module to resolve YouTube playlist ids Doesn't need any login or GoogleAPI key
      ytpl    = require("ytpl"),
// —— Simple js only module to search YouTube Doesn't need any login or GoogleAPI key
      ytsr    = require("ytsr");


(async() => {

    const url = "https://www.youtube.com/watch?v=noCUDLkjUQ4&list=PLfkpjMPulxvY2AKUVBJJvZ0FTpBa95sKs&index=2&t=0s"

    let player = {
        queue      : [],
        connection : null,
        dispatcher : null,
        isPlaying  : false,
        volume     : 1,
    };

    const playlist = await ytpl(url).catch(err => err)

    if (playlist instanceof Error)
        console.log("error", playlist)
        && super.respond("— Playlist error")

    for (let i = 0; i < playlist.items.length; i++) {
        console.log(playlist.items[i]);
    }

})()
