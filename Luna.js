/* –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
       __                         __   ____        __
      / /   __  ______  ____ _   / /  / __ )____  / /_
     / /   / / / / __ \/ __ `/  / /  / __  / __ \/ __/
    / /___/ /_/ / / / / /_/ /  / /  / /_/ / /_/ / /_
   /_____/\__,_/_/ /_/\__,_/  / /  /_____/\____/\__/
                             /_/
–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– */
// ██████ Integrations ██████████████████████████████████████████████████████████

const Discord = require("discord.js"),                                          // A powerful library for interacting with the Discord API
      moment  = require("moment"    ),                                          // Parse, validate, manipulate, and display dates
      dotenv  = require("dotenv"    ),                                          // Loads environment variables from .env file
      chalk   = require("chalk"     ),                                          // Terminal string styling done right
      sql     = require("sqlite"    ),                                          // SQLite client for Node.js applications with SQL-based migrations API
      fs      = require("fs"        );

// ██████ Initialization ███████████████████████████████████████████████████████

dotenv.config()                                                                  // Loads environment variables from .env file

const client = new Discord.Client({ autoReconnect: true }),                     // Create a new Discord client
      active = new Map(),
      db     = sql.open('database.sqlite', { Promise });

client.commands = new Discord.Collection();

function timestamp() {                                                          // Logger timestamp
    return chalk.grey(moment().format("MM/DD HH:mm:ss"))
}

function error(err) {
    console.error(chalk.bold.red(timestamp() + " × 🐛", err));
}

/* ██████ Handler ██████████████████████████████████████████████████████████████

    A command handler can divide the different commands and events, in
    separate batch file in subdirectories, providing more clarity. This also
    allows better configuration, to define aliases, a cooldown, and to manage
    bugs more easily.                                                           */

// –– Event Handler ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

fs.readdir("./events/", (err, files) => {                                        // Imports all event files

    if (err) return error(err);                                                 // Notifies in case of error

    files.forEach(file => {                                                       // For each file found in the events folder
        const event = require(`./events/${file}`);                               // Include the file to be able to operate on it
        const eventName = file.split(".")[0];                                    // Retrieve the filename without taking into consideration the '.js'.
        client.on(eventName, event.bind(null, client));                         // Executes the file corresponding to the transmitted event.
    });
});

// –– Command Handler ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
                                                                                // Imports all command files
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {                                               // For each file found
    const Commande = require(`./commands/${file}`);                              // Include the file to be able to operate on it
    client.commands.set(Commande.name, Commande);                               // Parse the file to retrieve the assigned name.
}

const cooldowns = new Discord.Collection();                                     // Creating a value "dictionary"

client.on("message", async message => {                                         // Upon receipt of a new message
                                                                                // Exclude messages from the bot and those not starting with a prefix
    if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;
																				// Decomposition of arguments
    const args = message.content.slice(process.env.PREFIX.length).split(/ +/),
        NCommande = args.shift().toLowerCase(), 								// Standardization of arguments
																				// Look for aliases if they exist.
        Commande = client.commands.get(NCommande) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(NCommande));

    if (!Commande) return;														// If no aliases or command files are found, stop.

    if (Commande.guildOnly && message.channel.type !== "text") { 				// Check that the configuration of the command authorize execution in MP
        return message.reply("This command cannot be executed as a private message.");
    }

    if (Commande.args && !args.length) { 										// Check whether arguments are required and whether they are present.
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (Commande.usage) { 													// If a syntactical indication is provided, give it as a template.
            reply += `\nThe correct use would be: \`${process.env.PREFIX}${Commande.name} ${Commande.usage}\``;
        }
        return message.channel.send(reply); 									// Sending the reply
    }

    if (!message.member.roles.some(role => role.name === Commande.privileges)) {// Command Privilege
        return message.reply("You do not have the necessary privileges to execute this command...");
    }

    if (!cooldowns.has(Commande.name)) { 										// If the command has a cooldowns
        cooldowns.set(Commande.name, new Discord.Collection()); 				// Creation of a new dictionary to store duration
    }

    const now = Date.now(), 													// Retrieving the Current Date and Time
        timestamps = cooldowns.get(Commande.name),								// Retrieving the specified duration of the cooldown
        cooldownAmount = (Commande.cooldown || 3) * 1000;						// Converting to seconds and adding the value to a new variable

    if (timestamps.has(message.author.id)) {									// If the cooldowns are not assigned to a user,

        const expirTime = timestamps.get(message.author.id) + cooldownAmount;	// Assigns to the user who triggered the command

        if (now < expirTime) {													// Check if the cooldowns are exceeded
            const timeLeft = (expirTime - now) / 1000;							// Remaining time conversion
            return message.reply(`Please wait ${timeLeft.toFixed(1)} second(s) to reuse the command \`${Commande.name}\`.`);
        }
    }

    timestamps.set(message.author.id, now);										// "Add a timer to the user"
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);		// When the time has elapsed, this timer is deleted.

    try { 																		// Try to execute the command
        const ops = {active};
		Commande.execute(client, message, args, ops);
    } catch (error) {
        message.reply("There seems to have been an error with this command, try again later!");
        console.error(error);
    } finally {
        console.log(`${timestamp()} │ ${chalk.bold(`"${message.author.tag}"`)} : ${message}`);
    }
});

client.login(process.env.TOKEN); 												// Authentication token