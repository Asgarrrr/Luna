// ██████ Integrations █████████████████████████████████████████████████████████

// —— Terminal string styling done right
const chalk       = require("chalk"     ),
// —— NodeJS Core Module Extended
      os          = require("os"        );

// ██████ | ███████████████████████████████████████████████████████████ | ██████

class Language {

    constructor(client) {

        this.client   = client;

        this.language = {

            // ██████ EVENTS ███████████████████████████████████████████████████

            // —— Events > ready.js ————————————————————————————————————————————
            ready: () => [
                `${chalk.bold("Connected")} — ${client.user.tag} is here !`,
                `On ${client.guilds.cache.size} servers, for ${client.users.cache.size} users and ${client.channels.cache.size} channels`,
                `${client.user.tag} is online, hosted by ${os.hostname()}`
            ],

            // —— Events > message.js ——————————————————————————————————————————
            message : (message, cmd) =>  [
                (tLeft) => `Please wait ${tLeft} second(s) to reuse the ${cmd.help.name} command.`,
                "This command cannot be executed as a direct message.",
                `You didn't provide any arguments, ${message.author} !`,
                {
                    title : `${cmd.help.name.replace(/\b\w/g, (l) => l.toUpperCase())}`,
                    description: `> *${cmd.help.description}*`,
                    fields : [
                        {
                            name: "Syntax",
                            value:`\`\`\`${cmd.help.usage}\`\`\``
                        },
                        {
                            name: "Examples use",
                            value:`\`\`\`${cmd.help.exemple && cmd.help.exemple.map((x) => `${client.config.prefix}${cmd.help.name} ${x}`).join("\n") || "No examples provided"}\`\`\``
                        },
                    ]
                 },
                "You lack the required privileges to execute this command...",
            ],

            // ██████ COMMANDS █████████████████████████████████████████████████

            ping: (time, message) => [
                `   Latency │ ${time - message.createdTimestamp}ms`,
                ` Websocket │ ${client.ws.ping}ms`,
                "— Services",
                "— Servers Status",
                "— Maintenance & Incidents",
                `Command executed by @${message.author.tag}`,
            ],

            avatar: (target) => [
                "in DM, you can only target a user with his ID",
                `**This is your avatar, <@${target.id}>**`,
                `**This is the profile picture of <@${target.id}>**`,
                "Unable to retrieve user information"
            ],

            lvlUp : (lvl) => `You've leveled up to level **${lvl}**! Yeaa ^^`

        };
    }

    get(term, ...args) {
        const value = this.language[term];
        return typeof value === "function" ? value(...args) : value;
    }
}

module.exports = Language;