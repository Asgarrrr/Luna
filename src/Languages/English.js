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

            flag  : "🇬🇧",

            // ██████ EVENTS ███████████████████████████████████████████████████

            // —— Events > ready.js ————————————————————————————————————————————
            ready: () => [
                `${chalk.bold("Connected")} — ${client.user.tag} is here !`,
                `On ${client.guilds.cache.size} servers, for ${client.users.cache.size} users and ${client.channels.cache.size} channels`,
                `${client.user.tag} is online, hosted by ${os.hostname()}`
            ],

            // —— Events > message.js ——————————————————————————————————————————

            message : (message, cmd) => [
                (tLeft) => `Please wait ${tLeft} second(s) to reuse the ${cmd.name} command.`,
                "Sorry, this command can only be used by the bot owners.",
                "Sorry, this command can only be used in a discord server.",
                "Sorry, this command can only be ran in a NSFW marked channel.",
                `You didn't provide any arguments, ${message.author} !`,
                {
                    title : `${cmd.name.replace(/\b\w/g, (l) => l.toUpperCase())}`,
                    description: `> *${cmd.description}*`,
                    fields : [
                        {
                            name: "Syntax",
                            value:`\`\`\`${cmd.usage}\`\`\``
                        },
                        {
                            name: "Examples use",
                            value:`\`\`\`${cmd.exemple && cmd.exemple.map((x) => `${client.config.prefix}${cmd.name} ${x}`).join("\n") || "No examples provided"}\`\`\``
                        },
                    ]
                 },
                "I do not have sufficient rights to execute this command.",
                "You lack the required privileges to execute this command..."
            ],


            guildBanAdd: () => ["Banning", "Reason", "No reason provided", "Executor" ],

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

            language: () => [
                "What language do you want to use?",
                "I speak english now !"
            ],

            setlog: () => [
                "The specified channel was not found",
                "The channel could not be defined",
                "This channel will be assigned to log messages"
            ],

            ban: () => [
                "You need to choice a valid user",
                "You cannot banner yourself",
                "You cannot banish me;3",
                "Target member is higher in role hierarchy than you.",
                "Oww it's too powerful I can't !! èwé",
                "Banning",
                "Reason",
                "No reason provided",
                "Executor",
                "Damn, I think something happened :(",
            ],

            unban: () => [
                "You need to choice a valid user",
                "You can't unban yourself.",
                "User was not found in the list of banned members",

            ],


            kick: () => [
                "You need to choice a valid user",
                `You cannot kick yourself`,
                `You cannot kick me !!`,
                "Target member is higher in role hierarchy than you.",
                "Too heavy, I can't put it outside ;(",
                "Kicking",
                "Reason",
                "No reason provided",
                "Executor",
                "Damn, I think something happened :(",
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