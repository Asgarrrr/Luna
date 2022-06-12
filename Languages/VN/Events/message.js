module.exports = {

    owner       : "Xin lỗi, chỉ chủ sở hữu bot mới có thể sử dụng lệnh này.",
    server      : "Xin lỗi, lệnh này chỉ có thể được sử dụng trong máy chủ bất hòa.",
    nsfw        : "Rất tiếc, lệnh này chỉ có thể chạy trong kênh được đánh dấu NSFW.",
    cooldown    : ( command, message ) => `Vui lòng đợi ${( ( command.cmdCooldown.get( `${ message.guild ? message.guild.id : "mp" }-${ message.author.id }` ) - Date.now() ) / 1000 ).toFixed( 1 ) } second(s) to reuse the ${command.name} command.`,
    args        : ( message ) => `Bạn không cung cấp bất kỳ đối số nào, ${message.author} !`,

    helpEmbed   : ( cmd, message ) => { return {
        color       : `0x7354f6`,
        title       : `\` ${cmd.name.replace(/\b\w/g, (l) => l.toUpperCase())} \` Informations`,
        description : `> ${cmd.description}`,
        fields      : [{
            name    : "Syntax",
            value   :`\`\`\`${ message.guild.prefix }${ cmd.usage }\`\`\`\`[]\` = Required arguments, — \`{}\` = Optional arguments.`,
        }, {
            name    : "Example",
            value   :`\`\`\`${ cmd.example && cmd.example.map( ( x ) => `${ message.guild.prefix }${ cmd.name } ${ x }`).join( "\n" ) || "Không có ví dụ nào được cung cấp" }\`\`\``,
        }],
    }; },
    
    "missPerm"  : "Tôi không có đủ quyền để thực hiện lệnh này.",
    "youMiss"   : "Bạn thiếu các đặc quyền cần thiết để thực hiện lệnh này ...",
    lvlUp       : ( level, user ) => [
        `Làm tốt <@${ user._ID }>, bạn bây giờ là cấp ${ level }`,
        `Tiến bộ đáng kinh ngạc, <@${ user._ID }>, bạn vừa vượt qua cấp độ ${ level }`
    ][ ~~Math.random() * 2 ]

};