const guildPlayer = [{
    name : "(52) Rebel Yell / Eurobeat Remix"
},
{
    name : "(zdz) Rebel Yell / Eurobeat Remix"
},
{
    name : "(q) Rebel Yell / Eurobeat Remix"
},
{
    name : "(q) Rebel Yell / Eurobeat Remix"
},
{
    name : "(q) Rebel Yell / Eurobeat Remix"
},
{
    name : "(q) Rebel Yell / Eurobeat Remix"
},
{
    name : "(q) Rebel Yell / Eurobeat Remix"
}]

        let queueNtrack = [];

        for (let i = 0; i < 3; i++) {
            guildPlayer[i + 1] && queueNtrack.push(`${i+1}. ${guildPlayer[i + 1].name}`)
        }



        console.log(`
            Now : ${queueNtrack[0] && queueNtrack[0].name || "Nothing in playing" }

                ${queueNtrack.length === 0 ? "Nothing to play" : (queueNtrack.length === 1 ? "Next track" : "Nexts tracks")}
                ${queueNtrack.map(x => x).join("\n")}

                ${guildPlayer.length > 3 ? `And ${guildPlayer.length - 3} elements` : "" }



            `);