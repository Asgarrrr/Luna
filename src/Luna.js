
/*     __                      ____        __
      / /   __  ______  ____ _/ __ )____  / /_
     / /   / / / / __ \/ __ `/ __  / __ \/ __/
    / /___/ /_/ / / / / /_/ / /_/ / /_/ / /_
   /_____/\__,_/_/ /_/\__,_/_____/\____/\__/

   — An adorable Discord bot.           <3
   —— Free, Open Source and Cross Platform                                    */

// ██████ Integrations █████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API
const { Client, Collection } = require("discord.js");
// —— FileSystem
const { readdir }            = require("fs");

// ██████ Initialization ███████████████████████████████████████████████████████

// —— Create the Luna class, an extension of Client Discord
class Luna extends Client {

    constructor() {

        // —— Initialise discord.js client
        super({ autoReconnect: true });

        // —— Import of the parameters required for operation
        this.config     = require("./config");

        // —— Collection of all commands
        this.commands  = new Collection();

        // —— Collection of all command aliases
        this.aliases   = new Collection();

        // —— Used as a queue by the music system
        this.active    = new Collection();

        // —— SQLITE database management
        this.db        = require("./resources/DBInit")

        // —— Loads the language dictionary
        this.language  = new (require(`./resources/Languages/${[this.config.Language] || "English"}`))(this);

        // —— Import custom function (avoid duplicated block)
        this.func      = new (require("./resources/Functions"))(this);

        // —— Inform the user that the client has been initialised
        console.log(`Client initialised. —— Node ${process.version}.`);

        super.login(this.config.token);

        /* ██████ Handler ██████████████████████████████████████████████████████

        A handler can divide the different commands and events, in separate
        batch file in subdirectories, providing more clarity. This also allows
        better configuration, to define aliases, a cooldown, and to manage
        bugs more easily.                                                     */

        // –– Commands Handler –––––––––––––––––––––––––––––––––––––––––––––––––

        readdir("./Commands/", (err, cmdDir) => {
            // —— If there is error, throw an error in the console
            if (err) { throw err }
            // —— Only include directory
            cmdDir.filter((subDir) => !subDir.includes(".")).forEach((catDir) => {
                // —— Browse categories
                readdir(`./Commands/${catDir}/`, (err, cmds) => {
                    // —— If there is error, throw an error in the console
                    if (err) { throw err }
                    // —— Includes only .js files.
                    cmds.filter((file) => file.endsWith(".js")).forEach((cmd) => {
                        // —— Include the file to be able to operate on it
                        const command = new (require(`./Commands/${catDir}/${cmd}`))(this);

                        // —— Parse the file to retrieve the assigned name.
                        this.commands.set(command.help.name, command);

                        command.conf.aliases.forEach((a) => this.aliases.set(a, command.help.name));

                    });
                });
            });
        });

        // –– Events Handler –––––––––––––––––––––––––––––––––––––––––––––––––––

        // —— Imports all events files
        readdir("./Events/", (err, events) => {
            // —— If there is error, throw an error in the console
            if (err) { throw err }
            // —— includes only .js files
            events.filter((event) => event.endsWith(".js")).forEach((file) => {
                // —— Include the file to be able to operate on it
                const event = new (require(`./Events/${file}`))(this);
                // —— Executes the file corresponding to the transmitted event.
                super.on(file.split(".")[0], (...args) => event.run(...args));
            });
        });

    }
}

// —— Wake up, wake up, my child.
new Luna();