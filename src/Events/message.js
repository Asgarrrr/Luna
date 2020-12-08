
// Emitted whenever a message is created

class Message {

    constructor(client) {

        this.client = client;
    }

    async run(message) {

        const client = this.client;

        // —— Exclude messages from bot or system
        if (message.author.bot || message.system)
            return;

        // —— If message.member is uncached, fetch it
        if (!message.member && message.guild)
            message.member = await message.guild.members.fetch(message.author);

        // —— Experience module
        if (client.config.module.xp === true)
            client.func.setXp(message);

        // —— Exclude messages those not starting with prefix
        if (!message.content.startsWith(client.config.prefix))
            return;

        // —— Message decomposition
        const [cmd, ...args] = message.content.slice(client.config.prefix.length).trim().split(/ +/g);

        const command = client.commands.get(cmd.toLowerCase()) || client.commands.get(client.aliases.get(cmd.toLowerCase()));

        // —— If no aliases or command files are found, stop.
        if (!command)
            return;

        // —— Load translation data
        const lang = client.language.get(message.guild && message.guild.local || "English" ).message(message, command);

        // —— Checks if the command for this user is under cooldown
        if (command.cmdCooldown.has(message.author.id))
            return message.delete({ timeout: 10000 })
                && message.reply(lang[0](command.cmdCooldown.get(message.author.id)/1000))
                   .then((msg) => msg.delete({ timeout: 10000 }));

        if (command.ownerOnly && client.config.Master !== message.author.id)
            return message.reply('Sorry, this command can only be used by the bot owners.');

        // —— Checks if the command can be executed in DM
        if (command.guildOnly && !message.guild)
			return message.reply('Sorry, this command can only be used in a discord server.');

		if (command.nsfw && !message.channel.nsfw)
            return message.reply('Sorry, this command can only be ran in a NSFW marked channel.');

        // —— Checks if arguments are required and if they are present
        if (command.args && !args.length)
            return message.channel.send(!command.usage || "" ? lang[2] : { embed : lang[3] });

        if (message.guild) {

            const userPerms = message.channel.permissionsFor(message.member).missing(command.userPerms);

            if (userPerms.length)
                return message.reply(``)

            const botPerms = message.channel.permissionsFor(client.user).missing(command.botPerms);

			if (botPerms.length)
				return message.reply(``);

        }

        command.setMessage(message);

        // —— Run the command
        command.run(message, args);

        // —— Starts the cooldown if it is set
        if (command.cooldown > 0) command.startCooldown(message.author.id);

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
    }
}

module.exports = Message;