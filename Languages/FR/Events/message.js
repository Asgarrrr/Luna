module.exports = {

    owner       : "Désolé, cette commande ne peut être utilisée que par le propriétaires.",
    server      : "Désolé, cette commande ne peut être utilisée que sur un serveur",
    nsfw        : "Désolé, cette commande ne peut être exécutée que dans un salon NSFW..",
    cooldown    : ( command, message ) => `Veuillez attendre ${( ( command.cmdCooldown.get( message.author.id ) - Date.now() ) / 1000 ).toFixed(1) } seconde(s) pour réutiliser la commande ${command.name}.`,
    args        : ( message ) => `Vous n'avez fourni aucun argument, ${message.author} !`,
    helpEmbed   : ( cmd ) => { return {
        title       : `${cmd.name.replace(/\b\w/g, (l) => l.toUpperCase())}`,
        description : `> *${cmd.description}*`,
        fields      : [{
            name    : "Syntaxe",
            value   :`\`\`\`${cmd.usage}\`\`\``,
        }, {
            name    : "Exemples",
            value   :`\`\`\`${cmd.exemple && cmd.exemple.map((x) => `${client.config.prefix}${cmd.name} ${x}`).join("\n") || "No examples provided"}\`\`\``,
        }],
    }},
    "missPerm"  : "Je ne dispose pas des droits suffisants pour exécuter cette commande.",
    "youMiss"   : "Vous n'avez pas les privilèges nécessaires pour exécuter cette commande..."

}