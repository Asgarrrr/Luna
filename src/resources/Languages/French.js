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
                `${chalk.bold("Connecté")} — ${client.user.tag} est là !`,
                `Sur ${client.guilds.cache.size} serveurs, avec ${client.users.cache.size} utilisateurs et ${client.channels.cache.size} salons`,
                `${client.user.tag} est en ligne, hebergé par ${os.hostname()}`
            ],

            // —— Events > message.js ——————————————————————————————————————————
            message : (message, cmd) =>  [
                (tLeft) => `Veuillez patienter ${tLeft} seconde (s) pour réutiliser la commande ${cmd.help.name}.`,
                "Cette commande ne peut être exécutée en message direct.",
                `Vous n'avez fourni aucun argument ${message.author} !`,
                {
                    title : `${cmd.help.name.replace(/\b\w/g, (l) => l.toUpperCase())}`,
                    description: `> *${cmd.help.description}*`,
                    fields : [
                        {
                            name: "Syntax",
                            value:`\`\`\`${cmd.help.usage}\`\`\``
                        },
                        {
                            name: "Exemples d'utilisation",
                            value:`\`\`\`${cmd.help.exemple && cmd.help.exemple.map((x) => `${client.config.prefix}${cmd.help.name} ${x}`).join("\n") || "No examples provided"}\`\`\``
                        },
                    ]
                 },
                "Je n'ai pas les droits suffisants pour exécuter cette commande.",
                "Vous ne disposez pas des privilèges requis pour exécuter cette commande..."
            ],

            // ██████ COMMANDS █████████████████████████████████████████████████

            ping: (time, message) => [
                `   Latence │ ${time - message.createdTimestamp}ms`,
                ` Websocket │ ${client.ws.ping}ms`,
                "— Services",
                "— État des serveurs",
                "— Maintenance & Incidents",
                `Commande exécutée par @${message.author.tag}`,
            ],

            avatar: (target) => [
                "En MP, vous ne pouvez cibler qu'un utilisateur via son ID",
                `**Ceci est votre avatar, <@${target.id}>**`,
                `**Voici la photo de profil de <@${target.id}>**`,
                "Impossible de récupérer les informations utilisateur"
            ],

            language: () => [
                "Quelle langue voulez vous utiliser ?",
                "Je parle à present en Français !"
            ],

            lvlUp : (lvl) => `Vous avez atteint le niveau **${lvl}**! Yeaa ^^`

        };
    }

    get(term, ...args) {
        const value = this.language[term];
        return typeof value === "function" ? value(...args) : value;
    }
}

module.exports = Language;