// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command          = require( "../../../Structures/Command" )
// —— A light-weight module that brings window.fetch to node.js
    , fetch            = require( "node-fetch" )
// —— File system
    , { promises: fs } = require( "fs" )
// —— Canvas graphics API backed by Cairo
    , { createCanvas,
        loadImage }    = require( "canvas" );

// ██████ | ███████████████████████████████████████████████████████████████████

// —— Create & export a class for the command that extends the base command
class Setbackground extends Command {

	constructor( client ) {
		super( client, {
			name        : "setbackground",
			description : "Defines your profile background on a server",
			usage       : "setbackground { image url } [ sx sy ex ey ]",
			example     : [ "file attachement" ],
			args        : true,
			category    : "Fun",
            aliases     : ["setbg"],
			cooldown    : 30,
			userPerms   : "SEND_MESSAGES",
			allowDMs    : false,
		});

	}

	async run( message, [ url, sx, sy, ex, ey ] ) {

        try {

            // —— Try to get the image
            let res = await fetch( url, { timeout : 3000 } );

            // —— Restriction on accepted files
            if ( !res.headers.get( "content-type" ).match( /^image\/(png|jpeg|svg|gif|jpg)$/ ) )
                return super.respond( this.language.notAllowed );

            // —— Checks if the directory where the image will be saved exists
            await fs.access( "./Assets/rankCards" );

            // —— Create a new canvas and its context;
            const canvas = createCanvas( 1500, 500 )
                , ctx    = canvas.getContext( "2d" )
            // —— Waits until the image is loaded
                , image = await loadImage( await res.buffer() );

            // —— Input parameters are strings, they must be converted
            sx = parseInt(sx, 10) || 0;
            sy = parseInt(sy, 10) || 0;
            ex = parseInt(ex, 10) || image.width;
            ey = parseInt(ey, 10) || image.height;

            // —— Scaling formula
            const scale = Math.max( canvas.width / ( image.width - sx ), canvas.height / image.width );

            // —— Draws the image onto the canvas
            ctx.drawImage(
                image,
                sx, sy, ex, ey,
                0, 0, image.width * scale , image.height * scale
            );

            // —— Creates a Buffer object representing the image contained in the canvas
            const buffer = canvas.toBuffer( "image/png" );

            // —— Write the file in the directory provided
            await fs.writeFile( `Assets/rankCards/${message.guild.id}-${message.author.id}.png`, buffer );

            super.respond( this.language.newBG( message.author.id ) );

        } catch ( error ) {

            super.respond( this.language.error );

        }

    }

}

module.exports = Setbackground;