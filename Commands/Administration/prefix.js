// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command = require( "../../Structures/Command" );

// ██████ | ███████████████████████████████████████████████████████████████████

// —— Create & export a class for the command that extends the base command
class Prefix extends Command {

	constructor(client) {
		super(client, {
			name        : "prefix",
			description : "Change the prefix used by Luna in the guild",
			usage       : "prefix [prefix]",
			exemple     : [],
			args        : true,
			category    : "Administration",
			cooldown    : 10000,
			userPerms   : "ADMINISTRATOR",
			guildOnly   : true,
		});

	}

	async run( message, [ prefix ] ) {

        try {

            // —— Removes backslashes & applies changes
            prefix = prefix.replace( /\\/g, "" );

            if ( prefix === message.guild.prefix )
                return super.respond( "You already use this prefix" );

            // —— Save the new language in the database
            await this.client.db.Guild.findOneAndUpdate({
                _ID : this.message.guild.id
            }, {
                prefix : prefix,
            }).exec();

            this.message.guild.prefix = prefix;

            // —— Send a confirmation message
            super.respond( { embed: {
                color: "#7354f6",
                author: {
                    name: "The prefix has been changed"
                },
                description : `You can now use \`${prefix}\` to run commands.`
            }} )

        } catch ( error ) {
            super.respond({ embed : {
                color: "#c0392b",
                author: {
                    name: "The prefix has __not__ been modified"
                },
                description : "It seems that an error occurred ..."
            }});

        }

    }
}

module.exports = Prefix;