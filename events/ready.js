// ██████ Integrations ██████████████████████████████████████████████████████████

const { version } = require("discord.js"     ),                                 // A powerful library for interacting with the Discord API
      gradient    = require("gradient-string"),                                 // Beautiful color gradients in terminal output
      cpuStat     = require("cpu-stat"       ),                                 // CPU Statistics not provided by `os` module
      moment      = require("moment"         ),                                 // Parse, validate, manipulate, and display dates
      dotenv      = require("dotenv"         ),                                 // Loads environment variables from .env file
      chalk       = require("chalk"          ),                                 // Terminal string styling done right
      sql         = require("sqlite"         ),                                 // SQLite client for Node.js applications with SQL-based migrations API
      os          = require("os"             );                                 // NodeJS Core Module Extended

// –––––––––––––– | ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

dotenv.config();                                                                // Loads environment variables from .env file

function timestamp() {                                                          // Logger timestamp
    return chalk.grey(moment().format("MM/DD HH:mm:ss"))
}

function error(err) {
    console.error(chalk.bold.red(timestamp() + " × 🐛 ", err.message));
}

module.exports = async client => {

    const db = await sql.open('./database.sqlite');                             // Open (or create if not exist) sqlite database
                                                                                // Create Message table if not exist
    await db.all(`
        CREATE TABLE IF NOT EXISTS Message(
            ID          INTEGER PRIMARY KEY,
            Timestamp   DATETIME DEFAULT CURRENT_TIMESTAMP,
            User        TEXT,
            UserID      TEXT,
            Command     TEXT,
            Args        TEXT,
            CMDMSGID    TEXT
        );
    `);
                                                                                // Create Member table if not exist
    await db.all(`
        CREATE TABLE IF NOT EXISTS Members(
            ID          INTEGER PRIMARY KEY,
            Pseudo      TEXT,
            UserID      TEXT,
            Roles       TEXT,
            Nickname    TEXT,
            JoinDate    DATETIME DEFAULT CURRENT_TIMESTAMP,
            CreatesDate DATETIME,
            Bot         INTEGER,
            Xp          INTEGER,
            Lvl         INTEGER
        );
    `);
                                                                                // Create Ban table if not exist
    await db.all(`
        CREATE TABLE IF NOT EXISTS Ban(
            ID          INTEGER PRIMARY KEY,
            Pseudo      TEXT,
            UserID      TEXT,
            Timestamp   DATETIME DEFAULT CURRENT_TIMESTAMP,
            Applicant   TEXT,
            Motive      TEXT
        );
    `);

    await db.all(`
        CREATE TABLE IF NOT EXISTS Event(
            ID          INTEGER PRIMARY KEY,
            Timestamp   DATETIME DEFAULT CURRENT_TIMESTAMP,
            Type        TEXT,
            DATA        TEXT
        );
    `);

    const ASCIIHeader = [                                                       // Ascii header
        "    __                         __   ____        __   ",
        "   / /   __  ______  ____ _   / /  / __ )____  / /_  ",
        "  / /   / / / / __ \\/ __ `/  / /  / __  / __ \\/ __/",
        " / /___/ /_/ / / / / /_/ /  / /  / /_/ / /_/ / /_    ",
        "/_____/\\__,_/_/ /_/\\__,_/  / /  /_____/\\____/\\__/",
        "                          /_/"
    ].join('\n');

    await cpuStat.usagePercent((err, percent) => {                              // Print information about bot
        console.log([
            chalk.bold(gradient("#8EA6DB", "#6A54C9")(ASCIIHeader), "\n"),
            `Connected in ${chalk.bold(client.uptime)}ms as ${(client.user.tag)} ! `,
            `– On ${client.guilds.size} servers, covering ${client.channels.size} channels and ${client.users.size} users.`,
            ``,
            "               × ",
            `   Memory used │ ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB`,
            `           CPU │ ${os.cpus().map(i => `${i.model}`)[0]}`,
            `     CPU usage │ ${percent.toFixed(2)}%`,
            `      Platform │ ${os.platform()}`,
            `  Architecture │ ${os.arch()}`,
            "               × ",
            `    Discord.js │ v${version}`,
            `          Node │ ${process.version}`,
            "               ×",
            "               │"
        ].join("\n"));

        client.user.setAvatar("resources/icon.jpg")                             // Setting up the bot avatar
        .catch((err) => { error(err) })                                         // Common err: "You are changing your avatar too fast."

        client.user.setActivity(process.env.RICHPR, {                           // Setting up the bot activity
            type: process.env.RICHTY,
            url : process.env.RICURL
        });
    });

    const report = `${client.user.tag} was connected in ${client.uptime}ms from "${os.hostname()}"(${os.networkInterfaces()["en0"][1]["address"]})`
    await db.all(`INSERT INTO Event ('Type', 'DATA') VALUES ('READY', '${report}')`)
}