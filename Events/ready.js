// ██████ Integrations █████████████████████████████████████████████████████████

// —— Beautiful color gradients in terminal output
const gradient    = require("gradient-string")
// —— Terminal string styling done right
    , chalk       = require("chalk");

// ██████ Initialization ███████████████████████████████████████████████████████

class Ready {

    constructor(client) {

        this.enable = true;
        this.client = client;

    }

    async run() {

        const client = this.client,
                lang = client.language.get(client.config.Language || "English").ready();

        // —— Cleaning the console 💨
        console.clear();

        // —— Just an ascii header, because I like it.
        console.log(
            chalk.bold(
                gradient("#8EA6DB", "#7354F6")([
                    "    __                      ____        __     ",
                    "   / /   __  ______  ____ _/ __ )____  / /_    ",
                    "  / /   / / / / __ \\/ __ `/ __  / __ \\/ __/  ",
                    " / /___/ /_/ / / / / /_/ / /_/ / /_/ / /_      ",
                    "/_____/\\__,_/_/ /_/\\__,_/_____/\\____/\\__/  ",
                    "\n",
                ].join("\n")),
            )
            + lang.slice(0, 2).join("\n"),
        );

        // —— Setting up the bot avatar
        // x– Common err: "You are changing your avatar too fast."
        client.user.setAvatar("resources/Assets/Faces/Icon.png")
            .catch((error) => {
                console.error(error);
            });

        if (client.config.Presence) {

            const { status, games, interval } = client.config.Presence;

            // —— Set default presence
            games instanceof Array && games.length > 0 &&
                client.user.setPresence({
                    status,
                    activity: {
                        name: games[0].name ? games[0].name : null,
                        type: games[0].type ? games[0].type : null,
                        url : games[0].url  ? games[0].url  : null,
                    },
                });

            // —— If the user has chosen a multiple custom activity
            games instanceof Array && games.length > 1 &&
                // —— Every x seconds, the activity (and its type) will change.
                setInterval(() => {
                    // —— Generates a random number between 0 and the length of the game array
                    const index = Math.floor(Math.random() * (games.length));
                    // —— Redefined the bot's activity
                    client.user.setActivity(games[parseInt(index, 10)].name, {
                        type: games[parseInt(index, 10)].type,
                        url : games[parseInt(index, 10)].url || "https://www.twitch.tv/",
                    });
                }, ((typeof interval === "number" && interval) || 30) * 1000);
        }

        // —— Connection report inserted in the Event table
        client.db
            .prepare("INSERT INTO Event ('Type', 'DATA') VALUES ('READY', ?)")
            .run(lang[0]);

    }

}

module.exports = Ready;