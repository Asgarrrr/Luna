// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command = require( "../../Structures/Command" );

// ██████ | ███████████████████████████████████████████████████████████████████

// —— Create & export a class for the command that extends the base command
class Addrole extends Command {

	constructor( client ) {
		super( client, {
			name        : "addrole",
			description : "Lets you assign a role to a member.",
			usage       : "addrole { user mention / user ID } { role mention / role ID }",
			exemple     : ["@asgarrrr @moderator" ],
			args        : true,
			category    : "Administration",
			cooldown    : 100,
			userPerms   : "ADMINISTRATOR",
			allowDMs    : false,
		});

	}

	async run( message, [ target, ...roles ] ) {

        if ( !target )
            return super.respond( this.language.noTarget );

        if ( !roles.length )
            return super.respond( this.language.noRole );

        const { resolveMention } = this.client.utils;

        const member = await resolveMention( target, message.guild, 1 );

        if ( !member )
            return super.respond( this.language.noValidMember );

        const added = [];

        for ( const role of roles ) {

            try {

                const resolved = await resolveMention( role, message.guild, 2 );

                if ( !resolved || resolved.comparePositionTo( member.roles.highest ) > 0 )
                    continue;

                member.roles.add( resolved );
                added.push( role );

            } catch ( err ) { ( err ) => err; }

        }

        super.respond( added.length
            ? this.language.added( added )
            : this.language.nothing
        );

    }

}

module.exports = Addrole;