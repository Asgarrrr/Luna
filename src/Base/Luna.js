
// ██████ Integrations █████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API
const { Client, Collection } = require("discord.js");
// —— FileSystem
const { readdir }            = require("fs");
// —— Terminal string styling done right.
const chalk                  = require("chalk");

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
        readdir("./Languages", (err, languages) => {
            // —— If there is error, throw an error in the console
            if (err) { throw err; }
            // —— includes only .js files
            languages.filter((languages) => languages.endsWith(".js")).forEach((file) => {
                // —— Include the file to be able to operate on it
                const local = new (require(`../Languages/${file}`))(this);

                this.language.set(file.replace(/\.[^/.]+$/, ""), local.language);
            });
        });
    }

    login() {
        if(!this.config.token)
            throw new Error("No Token");
        super.login(this.config.token);
    }

    async resolveUser(search, guild){

        if (!search) return;

        return !isNaN(search) || search.match(/^<@(!|&)?(\d+)>$/)
            ? (
                search = search.replace(/\D/g,''),
                guild
                    ? guild.members.cache.get(search)
                    : await this.users.fetch(search).catch(() => {})
            )
            : (guild ? guild.members : this.users).cache.find((x) => x.username === search)

    };

    async resolveChannel(search, guild){

        if (!search) return;

        return !isNaN(search) || search.match(/^<#(!|&)?(\d+)>$/)
            ? (
                search = search.replace(/\D/g,''),
                guild
                    ? guild.channels.cache.get(search)
                    : await this.channels.fetch(search).catch(() => {})
            )
            : (guild ? guild.channels : this.channels).cache.find((x) => x.name === search)

    };

    async createUser(user, guild) {

        user = await this.resolveUser(user.id, guild);

        this.db
            .prepare("INSERT OR REPLACE INTO Members (_ID, UserID, GuildID, Guildname, Roles, JoinDate) VALUES (?, ?, ?, ?, ?, ?)")
            .run(`${guild.id}-${user.id}`, user.id, guild.id, guild.name, JSON.stringify(user._roles), user.joinedTimestamp);

    }


    async logger(type = "INFO", message) {

        if (this.config.logger !== true)
            return

        const time = `${chalk.grey(new Date().toLocaleTimeString())}`;

        switch (type) {
            case "INFO": console.log(`${time} │ ${message}`);
                break;

            case "WARNING": {
                console.log(`${time} ⨯ ${chalk.hex("#ba8b00")(message)}`);
                this.db
                    .prepare("INSERT INTO Event ('Type', 'DATA') VALUES ('WARNING', ?)")
                    .run(message);
            } break;

            default:
                break;
        }
    }

    init() {
        this.loadCommands();
        this.loadEvents();
        this.login();
        this.loadLocal();
    }

}

module.exports = Luna;