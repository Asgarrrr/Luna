module.exports = {

    owner       : "Sorry, this command can only be used by the bot owners.",
    server      : "Sorry, this command can only be used in a discord server.",
    nsfw        : "Sorry, this command can only be ran in a NSFW marked channel.",
    cooldown    : ( command, message ) => `Please wait ${( ( command.cmdCooldown.get( `${ message.guild ? message.guild.id : "mp" }-${ message.author.id }` ) - Date.now() ) / 1000 ).toFixed( 1 ) } second(s) to reuse the ${command.name} command.`,
    args        : ( message ) => `You didn't provide any arguments, ${message.author} !`,

    helpEmbed   : ( cmd, message ) => { return {
        color       : `0x7354f6`,
        title       : `\` ${cmd.name.replace(/\b\w/g, (l) => l.toUpperCase())} \` Informations`,
        description : `> ${cmd.description}`,
        fields      : [{
            name    : "Syntax",
            value   :`\`\`\`${ message.guild.prefix }${ cmd.usage }\`\`\`\`[]\` = Required arguments, — \`{}\` = Optional arguments.`,
        }, {
            name    : "Example",
            value   :`\`\`\`${ cmd.example && cmd.example.map( ( x ) => `${ message.guild.prefix }${ cmd.name } ${ x }`).join( "\n" ) || "No examples provided" }\`\`\``,
        }],
    }; },

    "missPerm"  : "I do not have sufficient rights to execute this command.",
    "youMiss"   : "You lack the required privileges to execute this command...",
    lvlUp       : ( level, user ) => [
        `Well done <@${ user._ID }>, you are now level ${ level }`,
        `Incredible progress, <@${ user._ID }>, you just passed level ${ level }`
    ][ ~~Math.random() * 2 ]

};