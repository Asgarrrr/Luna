// ██████ Integrations █████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API.
const { Client, Collection } = require("discord.js")
// —— Provides utilities for working with file and directory paths.
    , path                   = require("path")
// —— Glob implementation in JavaScript.
    , glob                   = require("glob");

// —————————————————————————————————————————————————————————————————————————————

require("../Structures/Guild");

const Command = require("./Command");

// ██████ Initialization ███████████████████████████████████████████████████████

// —— Create the Luna class, an extension of Client Discord
class Luna extends Client {

    constructor(options = {}) {

        // —— Initialise discord.js client
        super(options);

        // —— Import of the parameters required for operation
        this.config     = require("../config.js");
        // —— Collection of all commands
        this.commands  = new Collection();
        // —— Collection of all events
        this.event     = new Collection();
        // —— Collection of all command aliases
        this.aliases   = new Collection();
        // —— SQLITE database management
        this.db        = require("../resources/DBInit");
        // —— Loads the language dictionary
        this.language  = new Collection();
        // —— Import custom function (avoid duplicated block)
        this.func      = new (require("../resources/Functions"))(this);

        this.dashboard = require("../Dashboard/app")(this);

        // —— Inform the user that the client has been initialised
        console.log(`Client initialised. —— Node ${process.version}.`);

    }

    get directory() {
		return `${path.dirname(require.main.filename)}${path.sep}`;
	}

    /* ██████ Handler ██████████████████████████████████████████████████████████

    A handler can divide the different commands and events, in separate
    batch file in subdirectories, providing more clarity. This also allows
    better configuration, to define aliases, a cooldown, and to manage
    bugs more easily.                                                     */

    // –– Commands Handler –––––––––––––––––––––––––––––––––––––––––––––––––––––

    loadCommands() {

        glob(`${this.directory}/Commands/**/*.js`, (er, files) => {

            if (er) throw new Error(er);

            for (const file of files) {

                delete require.cache[[`${file}`]];
                const command = new (require(file))(this),
                      filename = file.slice(file.lastIndexOf("/") + 1, file.length - 3);

                if (!(command instanceof Command))
                    throw new TypeError(`${filename} does not seem to be a correct command...`);

                this.commands.set(command.name, command);

                command.aliases.length
                    && command.aliases.map((alias) => this.aliases.set(alias, command.name));
            }

        });

    }

    // –– Events Handler ––––––––––––––––––––––––––––––––––––––––——–––––––––––––

    loadEvents() {

        glob(`${this.directory}/Events/**/*.js`, (er, files) => {

            if (er) throw new Error(er);

            for (const file of files) {

                delete require.cache[[`${file}`]];
                const event     = new (require(file))(this),
                      eventname = file.slice(file.lastIndexOf("/") + 1, file.length - 3);

                if (event.enable)
                    super.on(eventname, (...args) => event.run(...args));

            }
        });

    }

    loadLocal() {

        glob(`${this.directory}/Languages/**/*.js`, (er, files) => {

            if (er) throw new Error(er);

            for (const file of files) {

                delete require.cache[[`${file}`]];
                const local     = new (require(file))(this),
                      localname = file.slice(file.lastIndexOf("/") + 1, file.length - 3);

                this.language.set(localname, local.language);

            }
        });

    }

    async login() {

        if(!this.config.Token)
            throw new Error("No token provided");

        await super.login(this.config.Token);

    }

    init() {
        this.loadCommands();
        this.loadEvents();
        this.login();
        this.loadLocal();
    }

}

module.exports = Luna;