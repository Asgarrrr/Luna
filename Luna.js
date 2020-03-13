/* █████████████████████████████████████████████████████████████████████████████
        __                      ____        __
       / /   __  ______  ____ _/ __ )____  / /_
      / /   / / / / __ \/ __ `/ __  / __ \/ __/
     / /___/ /_/ / / / / /_/ / /_/ / /_/ / /_
    /_____/\__,_/_/ /_/\__,_/_____/\____/\__/

   ██████ Requirement check ████████████████████████████████████████████████████ */

// File System
const fs            = require("fs");
var   settings;

function setup() {
    require("child_process").execSync("node setup.js", {
        stdio: [0, 1, 2]
    });
    settings = JSON.parse(fs.readFileSync("./settings.json", "utf-8"));
}

if (fs.existsSync("./settings.json")) {
    try {
        settings = JSON.parse(fs.readFileSync("./settings.json", "utf-8"));
    } catch (error) {
        setup();
    }
} else { setup(); }

// ██████ Integrations █████████████████████████████████████████████████████████

// A powerful library for interacting with the Discord API
const Discord       = require("discord.js"    ),
// Import custom function (avoid duplicated block)
      CFuncti       = require("./resources/Functions.js"),
// Parse, validate, manipulate, and display dates
      moment        = require("moment"        ),
// Terminal string styling done right
      chalk         = require("chalk"         ),
// The fastest and simplest library for SQLite3 in Node.js.
      SQL           = require("better-sqlite3"),
// A node.js client for talking to cleverbot.
      Cleverbot     = require("cleverbot-with-sessions"),

// –––––– Dashboard ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// Node.js compression middleware
      compression   = require("compression"   ),
// Node.js body parsing middleware
      bodyParser    = require("body-parser"   ),
// Fast, unopinionated, minimalist web framework
      express       = require("express"       ),
// help secure Express/Connect apps with various HTTP headers
      helmet        = require("helmet"        ),
// Create an express instance
      app           = express(),
// Create a server object
      server        = require("http"          ).createServer(app),
// Socket.io initialisation
      io            = require("socket.io"     )(server);

// ██████ Initialization ███████████████████████████████████████████████████████

// Create a new Discord client
const client    = new Discord.Client({ autoReconnect: true }),
      active    = new Map(),
      // Creating a value "dictionary"
      cooldowns = new Discord.Collection(),
      cleverbot = new Cleverbot("CC2sd62RBTZRhXc5tuuzGCKiqyg"),
      // Loads the language dictionary
      Glossary  = new(require(`./resources/Languages/${[settings.Language] || "English"}.js`)),
      // Open sqlite database
      db        = new SQL("./database.sqlite");
// SQLITE Tables and Index Setup
[
    "CREATE TABLE IF NOT EXISTS Message( ID INTEGER PRIMARY KEY, Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, User TEXT, UserID TEXT, Message TEXT, MessageID TEXT );",
    "CREATE TABLE IF NOT EXISTS Command( ID INTEGER PRIMARY KEY, Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, User TEXT, UserID TEXT, Command TEXT, Args TEXT, CMDMSGID TEXT );",
    "CREATE TABLE IF NOT EXISTS Members( ID INTEGER PRIMARY KEY, Pseudo TEXT, UserID TEXT, Roles TEXT, JoinDate DATETIME DEFAULT CURRENT_TIMESTAMP, CreatesDate DATETIME, Bot INTEGER, Xp INTEGER DEFAULT 0, Lvl INTEGER DEFAULT 0 );",
    "CREATE TABLE IF NOT EXISTS Ban    ( ID INTEGER PRIMARY KEY, Pseudo TEXT, UserID TEXT, Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, Applicant TEXT, Motive TEXT);",
    "CREATE TABLE IF NOT EXISTS Event  ( ID INTEGER PRIMARY KEY, Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, Type TEXT, DATA TEXT );",
    "CREATE UNIQUE INDEX IF NOT EXISTS idx_command_id ON Command (User);",
    "CREATE UNIQUE INDEX IF NOT EXISTS idx_members_id ON Members (UserID);",
].forEach((element) => {
    db.prepare(element).run();
});

db.pragma("synchronous  = 1");
db.pragma("journal_mode = wal");

// Collection for all commands
client.commands     = new Discord.Collection();

// Scoring system SQL query
client.GScore       = db.prepare("SELECT * FROM Members WHERE userID = ?");
client.SScore       = db.prepare("UPDATE Members SET Xp = ?, Lvl = ?");

// Useful functions
client.timestamp    = chalk.grey(moment().format("MM/DD HH:mm:ss"));
client.error        = (err) => {
    console.error(chalk.bold.red(client.timestamp + " × 🐛 ", err.message));
    db.prepare("INSERT INTO Event ('Type', 'DATA') VALUES ('ERROR', ?)").run(err.toString());
};

client.settings     = settings;

// Experience curve generation
var levels = [];

for (var lvl = 1; lvl <= 200; lvl++) {
    levels.push(Math.floor(lvl * Math.log(lvl) * 70));
}
var log = db.prepare("INSERT INTO Message ('User', 'UserID', 'Message', 'MessageID') VALUES (?, ?, ?, ?)");

/* ██████ Handler ██████████████████████████████████████████████████████████████

   A command handler can divide the different commands and events, in
   separate batch file in subdirectories, providing more clarity. This also
   allows better configuration, to define aliases, a cooldown, and to manage
   bugs more easily.                                                           */

// –– Event Handler ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// Imports all events files
fs.readdirSync("./events").filter((file) => file.endsWith(".js")).forEach((file) => {
    // Include the file to be able to operate on it
    const event     = require(`./events/${file}`),
    // Retrieve the filename without taking into consideration the '.js'.
          eventName = file.split(".")[0];
    // Executes the file corresponding to the transmitted event.
    client.once(eventName, event.bind(null, io, client, Glossary));
});

// –– Command Handler ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// Search the different command files
fs.readdirSync("./commands").forEach((dir) => {
    // Imports the different commands for each file
    fs.readdirSync(`./commands/${dir}`).filter((file) => file.endsWith(".js")).forEach((file) => {
        // Include the file to be able to operate on it
        const Commande = require(`./commands/${dir}/${file}`);
        // Parse the file to retrieve the assigned name.
        client.commands.set(Commande.name, Commande);
    });
});

// Upon receipt of a new message
client.on("message", (message) => {

    io.emit("message", {
        timestamp: moment().format("MM/DD HH:mm:ss"),
        Avatar: `<img class='logavatar' src='${message.author.avatarURL}'/>`,
        pseudo: message.author.tag,
        message: message.content
    });

    log.run((`${message.author.username}#${message.author.discriminator}`), message.author.id, message.content, message.id);

    // Exclude messages from bot
    if (message.author.bot) {
        return;
    }

// –– Gain of experience per message –––––––––––––––––––––––––––––––––––––––––––

    var score = client.GScore.get(message.author.id);
    score.Xp  = score.Xp + Math.floor(Math.random() * 10) + 1;

    // Calculation of the level based on experience
    var LIdx  = levels.indexOf(levels.find((x) => x > score.Xp)),
        Lvl   = score.Xp <= levels[parseInt(LIdx)] ? levels.indexOf(levels[LIdx - 1]) : levels.indexOf(levels[parseInt(LIdx)]);

    if (score.Lvl < Lvl) {
        message.reply(`Level up ! you're now level ${Lvl} !`);
    }

    // Updates the player's score
    client.SScore.run(score.Xp, Lvl);

// –– Command ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    // Exclude messages those not starting with a prefix
    if (!message.content.startsWith(settings.Prefix)) { return; }

    // Decomposition of arguments
    const args      = message.content.slice(settings.Prefix.length).split(/ +/),
    // Standardization of arguments
          NCommande = args.shift().toLowerCase(),
    // Look for aliases if they exist.
          Commande  = client.commands.get(NCommande) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(NCommande));

    // If no aliases or command files are found, stop.
    if (!Commande || message.system) { return; }

    // Check that the configuration of the command authorize execution in MP
    if (Commande.guildOnly && message.channel.type !== "text") {
        return message.reply("This command cannot be executed as a private message.");
    }

    // Command Privilege
    if (message.channel.type === "text") {
        if (!message.member.hasPermission(Commande.privileges)) {
            return message.reply("You do not have the necessary privileges to execute this command...");
        }
    }

    // Check whether arguments are required and whether they are present.
    if (Commande.args && !args.length || Commande.args > args.length) {
        message.reply("You didn't provide any arguments !");

        // If a syntactical indication is provided, give it as a template.
        if (Commande.usage) {

            CFuncti.delAfterSend(client, message, ({
                embed: {
                    title: Commande.name[0].toUpperCase() + Commande.name.slice(1),
                    fields: [{
                        name: "User's Guide",
                        value: `The correct use would be: \`${settings.Prefix}${Commande.name} ${Commande.usage}\``,
                    }],
                    footer: {
                        text: "Parameters : [] = Needed – {} = Optional",
                    }
                }
            }), "👌");
        }
        return;
    }

    // If the command has a cooldowns
    if (!cooldowns.has(Commande.name)) {
        // Creation of a new dictionary to store duration
        cooldowns.set(Commande.name, new Discord.Collection());
    }

    // Retrieving the Current Date and Time
    const now            = Date.now(),
    // Retrieving the specified duration of the cooldown
          timestamps     = cooldowns.get(Commande.name),
    // Converting to seconds and adding the value to a new variable
          cooldownAmount = (Commande.cooldown || 3) * 1000;

    // If the cooldowns are not assigned to a user,
    if (timestamps.has(message.author.id)) {

        // Assigns to the user who triggered the command
        const expirTime = timestamps.get(message.author.id) + cooldownAmount;

        // Check if the cooldowns are exceeded
        if (now < expirTime) {
            const timeLeft = (expirTime - now) / 1000;
            // Remaining time conversion
            return message.reply(`Please wait ${timeLeft.toFixed(1)} second(s) to reuse the command \`${Commande.name}\`.`);
        }
    }

    // "Add a timer to the user"
    timestamps.set(message.author.id, now);
    // When the time has elapsed, this timer is deleted.
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    // Try to execute the command
    try {
        const ops = { active };
        Commande.execute(Glossary, client, message, args, ops);
    } catch (err) {
        message.reply("There seems to have been an error with this command, try again later!");
        client.error(err);
    } finally {
        // Log informations
        console.log(`${client.timestamp} │ ${chalk.bold(`"${message.author.tag}"`)} : ${message}`);
    }
});

// Authentication token
client.login(settings.Token);


// ██████ Dashboard ████████████████████████████████████████████████████████████

var router = new express.Router();

// Set the view engine to ejs
app.set("view engine", "ejs")
   .use("/", router)
// Define the views directory
   .set("views", (__dirname, "Dashboard/views"))
// Helmet for safety and compression for ..... compression 😱!
   .use(helmet())
   .use(compression())
// Body parsing middleware
   .use(bodyParser.urlencoded({
        extended: true
   }))
// Serve static files and keep them in cache
   .use(express.static(__dirname + "/Dashboard/public", {
        maxAge: 31557600
   }));

// Start dashboard on port x or 3000
server.listen(settings.DashPort || 3000);

// –– Update functions –––––––––––––––––––––––––––––––––––––––––––––––––––––––––

function userEvQuery() {

    let UEMonth = Array(12).fill(0).map((e, i) => i * 0),
        LM      = "";

    db.prepare(`
        SELECT      JoinDate, COUNT(*)
        FROM        Members
        WHERE       DATE(JoinDate)
        LIKE        '${new Date("11-11-2019").getFullYear()}%'
        GROUP BY    strftime('%m-%Y', JoinDate);`).all().forEach((element) => {

        var MDate = new Date(Date.parse(element.JoinDate)).getMonth();

        LM < MDate ? LM = MDate : null;
        UEMonth.splice(MDate, 1, element["COUNT(*)"]);
    });

    UEMonth = UEMonth.splice(0, (LM + 1));
    return UEMonth;
}

function messageActQuery() {

    var MAct = [];

    db.prepare(`
        SELECT      Timestamp, COUNT(*)
        FROM        Message
        WHERE Timestamp > (SELECT DATETIME('now', '+1 day', '-7 day'))
        GROUP BY    strftime('%w', Timestamp)
        ORDER BY    timestamp ASC`).all().forEach((element) => {
        MAct.push([Date.parse(element.Timestamp), element["COUNT(*)"]]);
    });

    return MAct;
}

// Render dashboard

app.get("/", function (req, res) {
    res.render("pages/index", {
        Client: client,
        url: req.url,
        env: process.env,
        UserIncAnaly: userEvQuery(),
        MessageActivity: messageActQuery()
    });
});


/*

NOTE: UPDATE JSON VAR :

    delete require.cache[require.resolve('./settings.json')];
    settings      = require('./settings.json' );

*/