// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command = require("../../Structures/Command");

// ██████ | ███████████████████████████████████████████████████████████████████

// —— Create & export a class for the command that extends the base command
class Language extends Command {

	constructor(client) {
		super(client, {
			name        : "language",
			description : "Change the language used by Luna in the guild",
			usage       : `language [language]`,
			exemple     : ["french"],
			args        : true,
			category    : "Administration",
			cooldown    : 10000,
			userPerms   : "ADMINISTRATOR",
			allowDMs    : false,
		});

	}

	async run( message, [ language ] ) {




    }
}

module.exports = Language;