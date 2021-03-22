// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command = require( "../../Structures/Command" );

// ██████ | ███████████████████████████████████████████████████████████████████

// —— Create & export a class for the command that extends the base command
class Autorole extends Command {

	constructor(client) {
		super(client, {
			name        : "autorole",
			description : "Defines the roles assigned automatically when a new member joins",
			usage       : "autorole [operation] [role]",
			exemple     : ["on", "add @moderator", "remove @moderator", "v", "off"],
			args        : true,
			category    : "Administration",
			cooldown    : 100,
			userPerms   : "ADMINISTRATOR",
			allowDMs    : false,
		});

	}

	async run( message, [ operation, ...roles ] ) {

        // —— Enable or disable automatic role assignment
        if ( ["on", "off"].includes( operation ) ) {

            try {

                const state = operation === "on" ? true : false;

                // —— Disables or enables in the database
                const req = await this.client.db.Guild.updateOne(
                    { _ID: message.guild.id },
                    { $set : { "plugins.autorole.enabled": state } }
                );

                // —— Retrieve all roles
                const { plugins: { autorole : { roles: currentRoles } } } = await this.client.db.Guild.findOne( {_ID: message.guild.id}, "plugins.autorole.roles" );

                super.respond( { embed: req.nModified
                    ? state
                        ? {
                            title: this.language.enabled,
                            description: this.language.currentRoles( currentRoles )
                        } : {
                            title: this.language.disabled,
                        }
                    : {
                        title: this.language.noChanges( operation )
                } } );

            } catch ( error ) {

                super.respond( this.language.error );

            }

        }

        // —— Add or remove a role
        if ( ["a", "add", "r", "remove"].includes( operation ) ) {

            try {

                const { resolveMention } = this.client.utils;
                const cantAdd = [];

                // —— Validates all mentions entered by the user
                let roleslist = ( await Promise.all( roles.map( async ( role ) => {

                    return await resolveMention( role, message.guild, 2 );

                }) ) ).filter( ( role ) => {

                    // —— Luna can't give roles above her own
                    if ( role && role.comparePositionTo( message.guild.me.roles.highest ) < 0 )
                        return role;
                    else
                        cantAdd.push( role );

                } );

                if ( cantAdd.length )
                    return super.respond( { embed: {
                        title       : this.language.missPerms,
                        description : this.language.cantAdd( cantAdd )
                    } });

                if ( !roleslist.length )
                    return super.respond( this.language.nothingToAdd );

                // —— Retrieves information, and updates it. If the action is on "add", the role is added, otherwise, it is removed
                const req = await this.client.db.Guild.findOneAndUpdate(
                    { _ID: message.guild.id },
                    ["a", "add"].includes( operation )
                        ? { $addToSet   : { "plugins.autorole.roles": { $each: roleslist } } }
                        : { $pull       : { "plugins.autorole.roles": { $in: roleslist } } },
                    { new : true }
                );

                const confirmation = { embed: {
                    title       : this.language.assigned,
                    description : ` ${req.plugins.autorole.roles.map( ( role ) => `<@&${role}>` ).join( " " ) }`
                } };

                if ( req.plugins.autorole.enabled === false )
                    confirmation.embed.footer = {
                        text: this.language.notEnabled
                    };

                super.respond( confirmation );

            } catch ( error ) {

                super.respond( this.language.error );

            }

        }

        if ( ["v", "view"].includes( operation ) ) {

            const { plugins : { autorole: { roles }}} = await this.client.db.Guild.findOne({
                _ID: message.guild.id
            }, "plugins.autorole.roles");

            super.respond({ embed: {
                title: this.language.assigned,
                description: roles.map( ( role ) => `<@&${role}>`).join(", ")
            }});

        }

    }
}

module.exports = Autorole;