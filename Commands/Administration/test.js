

// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command = require("../../Structures/Command");

// ██████ | ███████████████████████████████████████████████████████████████████

// —— Create & export a class for the command that extends the base command
class Test extends Command {

	constructor(client) {
		super(client, {
			name        : "test",
			description : "Change the prefix used by Luna in the guild",
			usage       : `prefix`,
			exemple     : [],
			args        : false,
			category    : "Administration",
			cooldown    : 10000,
			userPerms   : "ADMINISTRATOR",
			allowDMs    : false,
		});

	}

	async run( message, [ prefix ] ) {

        this.client.emit("guildMemberAdd", message.member);

    }
}

module.exports = Test;


