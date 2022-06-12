module.exports = {

    owner       : "Désolé, cette commande ne peut être utilisée que par le propriétaires.",
    server      : "Désolé, cette commande ne peut être utilisée que sur un serveur",
    nsfw        : "Désolé, cette commande ne peut être exécutée que dans un salon NSFW..",
    cooldown    : ( command, message ) => `Veuillez attendre ${( ( command.cmdCooldown.get( `${ message.guild ? message.guild.id : "mp" }-${ message.author.id }` ) - Date.now() ) / 1000 ).toFixed( 1 ) } seconde(s) pour réutiliser la commande ${command.name}.`,
    args        : ( message ) => `Vous n'avez fourni aucun argument, ${message.author} !`,

    helpEmbed   : ( cmd, message ) => { return {
        color       : `0x7354f6`,
        title       : `\` ${cmd.name.replace(/\b\w/g, (l) => l.toUpperCase())} \` Informations`,
        description : `> ${cmd.description}`,
        fields      : [{
            name    : "Syntaxe",
            value   :`\`\`\`${ message.guild.prefix }${ cmd.usage }\`\`\`\`[]\` = Arguments obligatoires, — \`{}\` = Arguments facultatifs.`,
        }, {
            name    : "Exemple",
            value   :`\`\`\`${ cmd.example && cmd.example.map( ( x ) => `${ message.guild.prefix }${ cmd.name } ${ x }`).join( "\n" ) || "Aucun exemple fourni" }\`\`\``,
        }],
    }; },

    "missPerm"  : "Je ne dispose pas des droits suffisants pour exécuter cette commande.",
    "youMiss"   : "Vous n'avez pas les privilèges nécessaires pour exécuter cette commande...",
    lvlUp : ( level, user ) => [
        `Bien joué <@${ user._ID }>, vous êtes maintenant au niveau ${ level }`,
        `Incroyable, <@${ user._ID }>, vous venez de passer le niveau ${ level }`
    ][ ~~Math.random() * 2 ]

};