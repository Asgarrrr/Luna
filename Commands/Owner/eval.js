// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command = require( "../../Structures/Command" );

const clean = ( text ) => {
    return typeof( text ) === "string"
        ? text.replace( /`/g, "`" + String.fromCharCode( 8203 ) ).replace( /@/g, "@" + String.fromCharCode( 8203 ) )
        : text;
}

// ██████ | ███████████████████████████████████████████████████████████████████

// —— Create & export a class for the command that extends the base command
class Eval extends Command {

    constructor( client ) {
        super( client, {
            name        : "eval",
            description : "Run Javascript code.",
            usage       : "eval { code }",
            example     : ["console.log('hello');"],
            args        : true,
            category    : "Owner",
            userPerms   : "SEND_MESSAGES",
            guildOnly   : false,
            ownerOnly   : true
        } );
    }

    async run( message, [ ...code ] ) {

        // —— Loading of confidential variables
        const { Token, Secret, mongodb } = this.client.config;

        try {

            let evaled = eval( code.join( " " ) );

            if ( typeof evaled !== "string" )
                evaled = require( "util" ).inspect( evaled );

            // —— Deletes confidential variables
            evaled = evaled.replace( new RegExp( [ Token, Secret, mongodb ].join( "|" ), "gi" ), " ** Private content ** " );

            if ( evaled.length > 4000 )
                evaled = this.language.long;

            message.channel.send( clean( evaled ), { code: "js" } );

        } catch ( err ) {

            console.log(err);

            message.channel.send( "Error —— " + clean( err ), { code: "php" } );

        }

    }
}

module.exports = Eval;