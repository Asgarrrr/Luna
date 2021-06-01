// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command = require( "../../../Structures/Command" );

// ██████ | ███████████████████████████████████████████████████████████████████

// —— Create & export a class for the command that extends the base command
class Setbio extends Command {

	constructor(client) {
		super(client, {
			name        : "setbio",
			description : "Defines your profile phrase on a server",
			usage       : "setbio { message }",
			example     : [ "@asgarrrr" ],
			args        : true,
			category    : "Fun",
			cooldown    : 5,
			userPerms   : "SEND_MESSAGES",
			allowDMs    : false,
		});

	}

	async run( message, [ ...bio ] ) {

        try {

            const cleanBio = bio.join( " " ).substring( 0, 96 );

            const { n, ok } = await this.client.db.Member.updateOne({
                _ID         : message.author.id,
                _guildID    : message.guild.id
            }, {
                $set: { bio: cleanBio }
            });

            super.respond( this.language[ ( !n || !ok ) ? "unchanged" : "ok" ] );

        } catch ( error ) {

            super.respond( this.language.error );

        }

    }

}

module.exports = Setbio;