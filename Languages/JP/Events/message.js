module.exports = {

    owner       : "申し訳ありませんが、ボットの所有者のみがこのコマンドを使用できます。",
    server      : "申し訳ありませんが、このコマンドはdiscordサーバーでのみ使用できます。",
    nsfw        : "残念ながら、このコマンドは NSFW とマークされたチャネルでのみ実行できます.",
    cooldown    : ( command, message ) => `お待ちください ${( ( command.cmdCooldown.get( `${ message.guild ? message.guild.id : "mp" }-${ message.author.id }` ) - Date.now() ) / 1000 ).toFixed( 1 ) } 秒を再利用する ${command.name} コマンド.`,
    args        : ( message ) => `引数が指定されていません, ${message.author} !`,

    helpEmbed   : ( cmd, message ) => { return {
        color       : `0x7354f6`,
        title       : `\` ${cmd.name.replace(/\b\w/g, (l) => l.toUpperCase())} \` Informations`,
        description : `> ${cmd.description}`,
        fields      : [{
            name    : "Syntax",
            value   :`\`\`\`${ message.guild.prefix }${ cmd.usage }\`\`\`\`[]\` = Required arguments, — \`{}\` = Optional arguments.`,
        }, {
            name    : "Example",
            value   :`\`\`\`${ cmd.example && cmd.example.map( ( x ) => `${ message.guild.prefix }${ cmd.name } ${ x }`).join( "\n" ) || "例はありません" }\`\`\``,
        }],
    }; },

    "missPerm"  : "このコマンドを実行するための十分な権限がありません。",
    "youMiss"   : "このコマンドを実行するために必要な権限がありません...",
    lvlUp       : ( level, user ) => [
        `よくやった <@${ user._ID }>, あなたは今レベルです ${ level }`,
        `驚くべき進歩、 <@${ user._ID }>, あなたはちょうどそのレベルに合格しました ${ level }`
    ][ ~~Math.random() * 2 ]

};