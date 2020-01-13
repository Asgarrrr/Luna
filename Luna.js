/* –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
       __                         __   ____        __
      / /   __  ______  ____ _   / /  / __ )____  / /_
     / /   / / / / __ \/ __ `/  / /  / __  / __ \/ __/
    / /___/ /_/ / / / / /_/ /  / /  / /_/ / /_/ / /_
   /_____/\__,_/_/ /_/\__,_/  / /  /_____/\____/\__/
                             /_/
–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– */
// ██████ Integrations █████████████████████████████████████████████████████████

// A powerful library for interacting with the Discord API
const Discord = require("discord.js"),
// Parse, validate, manipulate, and display dates
      moment  = require("moment"    ),
// Loads environment variables from .env file
      dotenv  = require("dotenv"    ),
// Terminal string styling done right
      chalk   = require("chalk"     ),
// SQLite client for Node.js applications with SQL-based migrations API
      sql     = require("sqlite"    ),
      fs      = require("fs"        );

// ██████ Initialization ███████████████████████████████████████████████████████

// Loads environment variables from .env file
dotenv.config()

// Create a new Discord client
const client = new Discord.Client({ autoReconnect: true }),
    active   = new Map(),
    db       = sql.open('database.sqlite', { Promise });

client.commands = new Discord.Collection();

// Logger timestamp
function timestamp() {
    return chalk.grey(moment().format("MM/DD HH:mm:ss"))
}

// Error handling
function error(err) {
    console.error(chalk.bold.red(timestamp() + " × 🐛", err));
}

/* ██████ Handler ██████████████████████████████████████████████████████████████

    A command handler can divide the different commands and events, in
    separate batch file in subdirectories, providing more clarity. This also
    allows better configuration, to define aliases, a cooldown, and to manage
    bugs more easily.                                                           */

// –– Event Handler ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// Imports all event files
fs.readdir("./events/", (err, files) => {
    // Notifies in case of error
    if (err) return error(err);
    // For each file found in the events folder
    files.forEach(file => {
        // Include the file to be able to operate on it
        const event = require(`./events/${file}`);
        // Retrieve the filename without taking into consideration the '.js'.
        const eventName = file.split(".")[0];
        // Executes the file corresponding to the transmitted event.
        client.on(eventName, event.bind(null, client));
    });
});

// –– Command Handler ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// Imports all command files
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

// For each file found
for (const file of commandFiles) {
    // Include the file to be able to operate on it
    const Commande = require(`./commands/${file}`);
    // Parse the file to retrieve the assigned name.
    client.commands.set(Commande.name, Commande);
}

// Creating a value "dictionary"
const cooldowns = new Discord.Collection();

// Upon receipt of a new message
client.on("message", async message => {

    // Exclude messages from the bot and those not starting with a prefix
    if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;

    // Decomposition of arguments
    const args    = message.content.slice(process.env.PREFIX.length).split(/ +/),
    // Standardization of arguments
        NCommande = args.shift().toLowerCase(),
    // Look for aliases if they exist.
        Commande  = client.commands.get(NCommande) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(NCommande));

    // If no aliases or command files are found, stop.
    if (!Commande) return;

    // Check that the configuration of the command authorize execution in MP
    if (Commande.guildOnly && message.channel.type !== "text") {
        return message.reply("This command cannot be executed as a private message.");
    }

    // Check whether arguments are required and whether they are present.
    if (Commande.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        // If a syntactical indication is provided, give it as a template.
        if (Commande.usage) {
            reply += `\nThe correct use would be: \`${process.env.PREFIX}${Commande.name} ${Commande.usage}\``;
        }
        // Sending the reply
        return message.channel.send(reply);
    }

     // Command Privilege
    if (!message.member.roles.some(role => role.name === Commande.privileges)) {
        return message.reply("You do not have the necessary privileges to execute this command...");
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
        Commande.execute(client, message, args, ops);
    } catch (error) {
        message.reply("There seems to have been an error with this command, try again later!");
        console.error(error);
    } finally {
        // Log informations
        console.log(`${timestamp()} │ ${chalk.bold(`"${message.author.tag}"`)} : ${message}`);
    }
});

// Authentication token
client.login(process.env.TOKEN);