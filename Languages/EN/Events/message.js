module.exports = {

    owner       : "Sorry, this command can only be used by the bot owners.",
    server      : "Sorry, this command can only be used in a discord server.",
    nsfw        : "Sorry, this command can only be ran in a NSFW marked channel.",
    cooldown    : ( command, message ) => `Please wait ${( ( command.cmdCooldown.get( message.author.id ) - Date.now() ) / 1000 ).toFixed(1) } second(s) to reuse the ${command.name} command.`,
    args        : ( message ) => `You didn't provide any arguments, ${message.author} !`,
    helpEmbed   : ( cmd, client ) => { return {
        title       : `${cmd.name.replace(/\b\w/g, (l) => l.toUpperCase())}`,
        description : `> *${cmd.description}*`,
        fields      : [{
            name    : "Syntax",
            value   :`\`\`\`${cmd.usage}\`\`\``,
        }, {
            name    : "Examples use",
            value   :`\`\`\`${cmd.exemple && cmd.exemple.map((x) => `${client.config.prefix}${cmd.name} ${x}`).join("\n") || "No examples provided"}\`\`\``,
        }],
    }; },
    "missPerm"  : "I do not have sufficient rights to execute this command.",
    "youMiss"   : "You lack the required privileges to execute this command...",

};