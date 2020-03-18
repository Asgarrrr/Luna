// ██████ Integrations █████████████████████████████████████████████████████████

// A powerful library for interacting with the Discord API
const { version } = require("discord.js"        ),
// Beautiful color gradients in terminal output
      gradient    = require("gradient-string"   ),
// Loads settings variables from .json file
      settings    = require("./../settings.json"),
// CPU Statistics not provided by `os` module
      cpuStat     = require("cpu-stat"          ),
// Terminal string styling done right
      chalk       = require("chalk"             ),
// SQLite client for Node.js applications with SQL-based migrations API
      SQL         = require("better-sqlite3"    ),
// NodeJS Core Module Extended
      os          = require("os"                );

// –––––––––––––– | ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// Open sqlite database
const db  = new SQL("./database.sqlite"),
      log = db.prepare("INSERT INTO Event ('Type', 'DATA') VALUES ('READY', ?)");

module.exports = async (io, client, Glossary) => {

    console.clear();

    await cpuStat.usagePercent((err, percent) => {

        // Load Glossary
        Glossary = Glossary.get("ready", client, (settings.DashPort || 3000), os, percent, version)

        // Print informations
        console.log(
            chalk.bold(gradient("#8EA6DB", "#7354F6")([
                "    __                      ____        __     ",
                "   / /   __  ______  ____ _/ __ )____  / /_    ",
                "  / /   / / / / __ \\/ __ `/ __  / __ \\/ __/  ",
                " / /___/ /_/ / / / / /_/ / /_/ / /_/ / /_      ",
                "/_____/\\__,_/_/ /_/\\__,_/_____/\\____/\\__/  ",
                "\n",
            ].join("\n")))
        );

        Glossary.forEach((element) => {
            console.log(element);
        });

        if (settings.RichPType !== "NOTHING") {
            client.user.setActivity(settings.RichPresence, {
                type: settings.RichPType,
                url : settings.TwitchURL
            });
        }

        // Setting up the bot avatar –– Common err: "You are changing your avatar too fast."
        client.user.setAvatar("resources/icon.jpg")
            .catch((error) => {
                client.error(error);
            });

        if (err) { throw (err); }

    });

    // Connection report inserted in the Event table
    log.run(Glossary.get("readylog", client, os));
};