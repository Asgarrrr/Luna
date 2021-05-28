// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command = require( "../../../Structures/Command" )
// —— A light-weight module that brings window.fetch to node.js
    , fetch   = require( "node-fetch" );

// ██████ | ███████████████████████████████████████████████████████████ | ██████

// —— Create & export a class for the command that extends the base command
class Activity extends Command {

    constructor( client ) {
        super( client, {
            name: "activity",
        });
    }

    async run( interaction ) {

        if ( !this.client.guilds.cache.has( interaction.guild_id ) )
            return;

        const guild = this.client.guilds.cache.get( interaction.guild_id );

        if ( !guild.channels.cache.has( interaction.channel_id ) )
            return;

        const channel = guild.channels.cache.get( interaction.data.options[0].value );
        const orgChan = guild.channels.cache.get( interaction.channel_id );

        if ( channel.type !== "voice" )
            return orgChan.send( "You must choose a voice channel " );

        try {

            const res = await fetch(` https://discord.com/api/v8/channels/${ interaction.data.options[0].value }/invites`, {

                method: "POST",
                body: JSON.stringify({
                    max_age: 0,
                    target_type: 2,
                    target_application_id: interaction.data.options[1].value,
                }),
                headers: {
                    "Authorization": `Bot ${ this.client.config.Token }`,
                    "Content-Type": "application/json"
                }
            }).then( ( res ) => res.json() );

            this.client.api.interactions( interaction.id, interaction.token ).callback.post( { data: {
                type: 4,
                data: { content: `[Play ${ res.target_application.name } —](https://discord.gg/${res.code})` }
            }});

        } catch ( err ) { ( err ) => err; }

    }

}

module.exports = Activity;