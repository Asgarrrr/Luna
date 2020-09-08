
// Emitted whenever a message is created

class Message {

    constructor(client) {

        this.client = client;
    }

    async run(message, ops) {

        const client = this.client;

        // —— Exclude messages from bot or system
        if (message.author.bot || message.system) return;

        // —— If message.member is uncached, fetch it
        if (!message.member && message.guild) message.member = await message.guild.members.fetch(message.author);

        // —— Experience module
        if (client.config.module.xp === true) client.func.setXp(message);

        // —— Message log in the database
        client.db
            .prepare("INSERT INTO Messages VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
            .run(
                message.id,
                new Date(message.createdTimestamp).toLocaleString(),
                message.author.id,
                message.author.tag,
                message.channel.id,
                message.channel.name,
                message.guild && message.guild.id   || "DM",
                message.guild && message.guild.name || "DM",
                message.content,
                message.attachments.size !== 0 ? message.attachments.first().url : null
            );

        // —— Exclude messages those not starting with prefix
        if (!message.content.startsWith(client.config.prefix)) return;

        // —— Message decomposition
        const args    = message.content.split(/\s+/g),
              command = args.shift().slice(client.config.prefix.length),
              cmd     = client.commands.get(command) || client.commands.get(client.aliases.get(command));

        // —— If no aliases or command files are found, stop.
        if (!cmd) return;

        // —— Load translation data
        const lang = client.language.get("message", message, cmd);

        // —— Checks if the command for this user is under cooldown
        if (cmd.cooldown.has(message.author.id))
            return message.delete()
                && message.reply(lang[0](((cmd.cooldown.get(message.author.id) - Date.now()) / 1000)))
                   .then((msg) => msg.delete({ timeout: 10000 }));

         // —— Checks if the command can be executed in DM
         if (!cmd.conf.allowDMs && message.channel.type !== "text")
            return message.reply(lang[1]);

        // —— Checks if arguments are required and if they are present
        if (cmd.help.args && !args.length)
            return message.channel.send(!cmd.help.usage || "" ? lang[2] : {embed : lang[3]});

        // —— Verifies if Luna has the right to use the command
        if(!member.guild.me.hasPermission(cmd.conf.clientPerms))
            return message.reply(lang[4]);

        // —— Verifies that the user has the right to use the command
        if (!client.config.Master === message.author.id || !message.channel.type === "text" && message.member.permissions.has(cmd.conf.permission))
            return message.reply(lang[5]);

        cmd.setMessage(message);

        // —— Run the command
        cmd.run(message, args);

        // —— Starts the cooldown if it is set
        if (cmd.conf.cooldown > 0) cmd.startCooldown(message.author.id);

    }
}

module.exports = Message;