// ██████ Integrations █████████████████████████████████████████████████████████

const Interaction = require( "../Structures/Interaction" );

// ██████ | █████████████████████████████████████████████████████████████████████

class interactionCreate extends Interaction {

    constructor( client ) {
        super( client, {
            name: "INTERACTION_CREATE",
        });
    }

    async run( interaction ) {

        // —— Slash command
        if ( interaction.type === 2 ) {

            const { data : { name } } = interaction;

            const slash = this.client.slash.get( name.toLowerCase() );

            // —— If no aliases or command files are found, stop.
            if ( !slash )
                return;

            // —— Run the command
            slash.run( interaction );
        }

    }

}

module.exports = interactionCreate;