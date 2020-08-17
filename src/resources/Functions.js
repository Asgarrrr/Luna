
// ––––––––––– | –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

class Functions {

    constructor(client) {

        this.client = client;
        this.GScore = client.db.prepare("SELECT * FROM Members WHERE UserID = ? AND GuildID = ?");
        this.SScore = client.db.prepare("INSERT OR REPLACE INTO Members (_ID, UserID, GuildID, Xp, Lvl) VALUES (@_ID, @UserID, @GuildID, @Xp, @Lvl)");

    }

     // —— Experience module ————————————————————————————————————————————————————

    setXp(message) {

        const client = this.client;

        // —— Exclude private messages
        if (!message.guild) return;

        // —— Retrieve the player's information from the database, or create it.
        let score =
            this.GScore.get(message.author.id, message.guild.id)
            || { "_ID" : `${message.guild.id}-${message.author.id}`, "UserID" : message.author.id, "GuildID" : message.guild.id, "Xp" : 0, "Lvl" : 1 };

        // —— Give a random amount of xp per message
        let gain = Math.floor(Math.random() * 50) + 1;

        // –– Lucky drop, 1 chance in 1000 to multiply the gain by 100
        Math.floor(Math.random() * 1001) === 1000 && (gain = gain * 100);

        // –– Adds the gain to the old xp
        score.Xp = score.Xp + gain;

        const curLevel = Math.floor(0.1 * Math.sqrt(score.Xp));

        // —— LVL UP ! *Victory Fanfare* (Final Fantasy XI)
        if(score.Lvl < curLevel) {
            score.Lvl++;
            message.reply(client.language.get("lvlUp", curLevel));
        }

        // —— Save the updated score in the database
        this.SScore.run(score);

    }

}

module.exports = Functions;