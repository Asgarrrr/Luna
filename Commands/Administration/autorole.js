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
			exemple     : ["on", "add @moderator", "remove @moderator", "off"],
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

        // ——
        if ( ["a", "add", "r", "remove"].includes( operation ) ) {

            try {

                const { resolveMention } = this.client.utils
                    , cantAdd = [];

                // —— Validates all mentions entered by the user
                let roleslist = roles.map( async ( role ) => await resolveMention( role, message.guild, 2 ) );

                roleslist = await Promise.all( roleslist );

                roleslist = roleslist.filter( ( role ) => {

                    if ( role && role.comparePositionTo( message.guild.me.roles.highest ) <= 0 )
                        return role.id;
                    else
                        cantAdd.push( role );

                });

                if ( !roleslist.length )
                    return super.respond( this.language.noRole );

                // —— Retrieves information, and updates it. If the action is on "add", the role is added, otherwise, it is removed
                const req = await this.client.db.Guild.findOneAndUpdate(
                    { _ID: message.guild.id },
                    ["a", "add"].includes( operation )
                        ? { $addToSet   : { "plugins.autorole.roles": { $each: roleslist } } }
                        : { $pull       : { "plugins.autorole.roles": { $in: roles } } },
                    { new : true }
                );

                cantAdd.length && super.respond({ embed: {
                    title       : this.language.missPerms,
                    description : cantAdd.join(", ")
                }});

                const response = { embed: {
                    title       : this.language.assigned,
                    description : ` ${req.plugins.autorole.roles.map( ( role ) => `<@&${role}>` ).join( " " ) }`
                } };

                if ( req.plugins.autorole.enabled === false )
                    response.embed.footer = {
                        text: this.language.notEnabled
                    };

                super.respond( response );

            } catch ( error ) {

                super.respond( this.language.error );

            }

        }

    }
}

module.exports = Autorole;