
// ██████ Integrations █████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API
const { Client, Collection } = require("discord.js");
// —— FileSystem
const { readdir }            = require("fs");

const Guild                  = require("../Base/Guild");

// ██████ Initialization ███████████████████████████████████████████████████████

// —— Create the Luna class, an extension of Client Discord
class Luna extends Client {

    constructor(options) {

        // —— Initialise discord.js client
        super(options);

        // —— Import of the parameters required for operation
        this.config     = require("../config.json");
        // —— Collection of all commands
        this.commands  = new Collection();
        // —— Collection of all command aliases
        this.aliases   = new Collection();
        // —— SQLITE database management
        this.db        = require("../resources/DBInit");
        // —— Loads the language dictionary
        this.language  = new Collection();
        // —— Import custom function (avoid duplicated block)
        this.func      = new (require("../resources/Functions"))(this);

        // —— Inform the user that the client has been initialised
        console.log(`Client initialised. —— Node ${process.version}.`);

    }

    /* ██████ Handler ██████████████████████████████████████████████████████████

    A handler can divide the different commands and events, in separate
    batch file in subdirectories, providing more clarity. This also allows
    better configuration, to define aliases, a cooldown, and to manage
    bugs more easily.                                                     */

    // –– Commands Handler –––––––––––––––––––––––––––––––––––––––––––––––––––––

    loadCommands () {
        readdir("./Commands/", (err, cmdDir) => {
            // —— If there is error, throw an error in the console
            if (err) { throw err; }
            // —— Only include directory
            cmdDir.filter((subDir) => !subDir.includes(".")).forEach((catDir) => {
                // —— Browse categories
                readdir(`./Commands/${catDir}/`, (err, cmds) => {
                    // —— If there is error, throw an error in the console
                    if (err) { throw err; }
                    // —— Includes only .js files.
                    cmds.filter((file) => file.endsWith(".js")).forEach((cmd) => {
                        // —— Include the file to be able to operate on it
                        const command = new (require(`../Commands/${catDir}/${cmd}`))(this);
                        // —— Parse the file to retrieve the assigned name.
                        this.commands.set(command.help.name, command);

                        command.conf.aliases.forEach((a) => this.aliases.set(a, command.help.name));
                    });
                });
            });
        });
    }

    // –– Events Handler ––––––––––––––––––––––––––––––––––––––––——–––––––––––––

    loadEvents () {
        readdir("./Events", (err, events) => {
            // —— If there is error, throw an error in the console
            if (err) { throw err; }
            // —— includes only .js files
            events.filter((event) => event.endsWith(".js")).forEach((file) => {
                // —— Include the file to be able to operate on it
                const event = new (require(`../Events/${file}`))(this);
                // —— Executes the file corresponding to the transmitted event.
                super.on(file.split(".")[0], (...args) => event.run(...args));

            });
        });
    }

    loadLocal () {
        readdir("./resources/Languages", (err, languages) => {
            // —— If there is error, throw an error in the console
            if (err) { throw err; }
            // —— includes only .js files
            languages.filter((languages) => languages.endsWith(".js")).forEach((file) => {
                // —— Include the file to be able to operate on it
                const local = new (require(`../resources/Languages/${file}`))(this);

                this.language.set(file.replace(/\.[^/.]+$/, ""), local.language);
            })

        })
    }

    login() {

        if(!this.config.token)
            throw new Error("No Token");
        super.login(this.config.token)
    }

    init() {
        this.loadCommands();
        this.loadEvents();
        this.login()
        this.loadLocal()
    }

}

module.exports = Luna