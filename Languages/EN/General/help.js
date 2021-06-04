module.exports = {

    doc         : "Documentation",
    notFound    : "The command you are looking for was not found, maybe you should check the list of all available commands",
    pTitle      : ( cName ) => `\` ${cName[0].toUpperCase()}${cName.slice(1)} \` Informations`,
    pSName      : "Syntax",
    pSValue     : ( p, cmdUs ) => `\`\`\`${p}${cmdUs}\`\`\`\`[]\` = Required arguments, — \`{}\` = Optional arguments.`,
    pEName      : "Example",
    pEValue     : ( p, cmdEx ) => `\`\`\`${cmdEx && cmdEx.map( ( ex ) => `${p}${ex}` ).join( "\n" ) || "No examples provided" }\`\`\`\n`,

    firstTitle  : "Luna — to the rescue!",
    firstDesc   : "Luna is an adorable open source discord bot fully customizable created in javascript, using Discord.js and mongoDB that is constantly growing !\n\nYou can display the different commands by categories via the buttons below, or consult the more detailed list of commands [here](https://lunadoc.vercel.app/).\n\n[Add me to your server](https://discord.com/oauth2/authorize?client_id=662331369392832512&permissions=8&scope=bot%20applications.commands) • [Buy me a coffee](https://www.buymeacoffee.com/Asgarrrr)",
    list        : "List of commands",
    footer      : ( p ) => `You can type ${p}help with the name of command for details`

};