// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command = require( "../../Structures/Command" );

// ██████ | ███████████████████████████████████████████████████████████████████

// —— Create & export a class for the command that extends the base command
class Language extends Command {

	constructor( client ) {
		super( client, {
			name        : "language",
			description : "Change the language used by Luna in the guild",
			usage       : "language [language]",
			example     : ["FR"],
			args        : false,
			category    : "Administration",
			cooldown    : 10000,
			userPerms   : "ADMINISTRATOR",
			allowDMs    : false,
		});

	}

	async run( message, [ language ] ) {

        const available = Object.keys( this.client.language );

        if ( language && available.includes( language ) ) {

            return await this.save( language, message );

        } else {

            const awaitReponse = await super.respond({ embed: {
                title       : this.language.choose,
                description : available.map( ( lang ) => {

                        const { ISO, name } = this.client.language[lang].informations;
                        return `\` ${ISO} \` : ${name} `;

                    }).join( "\n" ),

                footer      : {
                    text    : this.language.howUse,
                }
            }});

            const collector = message.channel.createMessageCollector(
                ( m ) => available.includes( m.content ) && m.author.id === message.author.id,
                { time: 15000, max: 1 }
            );

            collector.on( "collect", async ( m ) => { await this.save( m.content, m ); } );

            collector.on( "end", ( ) => awaitReponse.delete( ) );

        }

    }

    async save( language, message ) {

        // —— Save the new language in the database
        await this.client.db.Guild.findOneAndUpdate({
            _ID : message.guild.id
        }, {
            language,
        }).exec();

        message.guild.language = language;

        // —— Send a confirmation message
        super.respond( { embed: {
            color: "#7354f6",
            author: {
                name: this.client.language[language].language.done
            },
            description : this.client.language[language].language.new
        }} );

    }
}

module.exports = Language;