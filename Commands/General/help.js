// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command               = require( "../../Structures/Command" )
// —— File system
    , fs                    = require("fs").promises
// —— A fast and easy API to create a buttons in discord using discord.js
    , { MessageButton,
        MessageActionRow }  = require( "discord-buttons");

// ██████ | ███████████████████████████████████████████████████████████████████

// —— Create & export a class for the command that extends the base command
class Help extends Command {

    constructor( client ) {
        super( client, {
            name        : "help",
            description : "Displays the list of available commands",
            usage       : "help { command }",
            category    : "General",
            args        : false,
            botPerms    : "SEND_MESSAGES",
            userPerms   : "SEND_MESSAGES",
            guildOnly   : false
        } );
    }

    async run( message, [ command ] ) {

        if ( command ) {

            // —— Standardization
            command = command.toLowerCase();

            // —— Delete the prefix if it has been used
            if ( command.startsWith( message.guild.prefix ) )
                command = command.substring( message.guild.prefix.length );

            // —— Search the command among those available
            const commandData = message.client.commands.find(
                ( c ) => c.name === command
                || c.aliases.includes( command )
            );

            if ( !commandData )
                return super.respond( this.notFound );

            super.respond( { embed: {
                color       : "0x7354f6",
                title       : this.language.pTitle( commandData.name ),
                description : `> ${commandData.description}`,
                fields      : [{
                    name    : this.language.pSName,
                    value   : this.language.pSValue( message.guild.prefix, commandData.usage ),
                }, {
                    name    : this.language.pEName,
                    value   : this.language.pEValue( message.guild.prefix, commandData.example ),
                }],
            }});

            return;

        }

        // —— Takes a random Luna face
        const faceFoler      = await fs.readdir( "./Assets/Faces" )
            , face           = faceFoler[ ~~( Math.random() * faceFoler.length ) ]

        const { chunks } = message.client.utils;

        // —— Group commands by categories
        const categories = message.client.commands.reduce( ( groups, item ) => ({
            ...groups,
            [item.category]: [...( groups[item.category] || []), item]
        } ), {} );

        let buttons = [];

        // —— Generates buttons with category names
        for (const category in categories ) {
            if ( Object.hasOwnProperty.call( categories, category ) ) {

                if ( category === "Owner" )
                    continue;

                buttons.push(
                    new MessageButton()
                        .setLabel( category )
                        .setStyle("grey")
                        .setID( category )
                );

            }
        }

        buttons.push(
            new MessageButton()
                .setLabel( this.language.doc )
                .setStyle( "url" )
                .setURL( "https://lunadoc.vercel.app" )
         );

        // —— Generates rows of buttons
        buttons = [ ...chunks( buttons, 5 ) ].map( ( r ) => {
            return new MessageActionRow().addComponents( r );
        });

        const pagination = await message.channel.send({
            embed: {
                color       : "0x7354f6",
                title       : this.language.firstTitle,
                thumbnail   : {
                    url     : `attachment://${face}`
                },
                description : this.language.firstDesc,
            },
            components      : buttons,
            files           : [{
                attachment  : `./Assets/Faces/${face}`,
                name        : face
            }],
        })

        // —— Creation of a collector, it will react when a user presses a button on the targeted message
        const collector = pagination.createButtonCollector(
            ( ) => true,
            // —— Collector for 5 minutes
            { time: 300000 });
        // —— When a user who has passed the filter uses a button
        collector.on( "collect", async ( button ) => {

            // —— Changes the color of the button to blue - Indicates the current page
            const thisButton = buttons.map( ( c ) => c.components.find( ( b ) => b.custom_id === button.id && !button.url ));
            thisButton && ( thisButton[0].style = 1 );

            // —— Editing the content, and the buttons, according to the page
            await pagination.edit({
                embed: {
                    color       : "0x7354f6",
                    author      : {
                        name    : this.language.list,
                    },
                    title       : button.id,
                    description : [
                        "```",
                        categories[button.id].map( ( cmd ) => {
                            return `${message.guild.prefix}${cmd.name.padEnd( 12 , " ")}${cmd.description}`
                        }).join( "\n" ),
                         "```",
                    ].join( "\n" ),
                    footer      : {
                        text    : this.language.footer( message.guild.prefix ),
                        icon_url: `attachment://${face}`
                    }
                },
                components      : buttons
            });

            // —— Reset the default gray color of the buttons
            buttons.forEach( ( c ) => c.components.forEach( ( b ) => !b.url && ( b.style = 2 ) ) );

            // —— Confirms to the "interaction" that it has worked
            await button.defer();

        });
        // —— At the end, the interaction with the buttons is not allowed anymore, we will disable them
        collector.on("end", async ( ) => {

            // —— Editing the message, remove the embeds
            await pagination.delete().catch( ( err ) => err );
        });

    }

}

module.exports = Help;