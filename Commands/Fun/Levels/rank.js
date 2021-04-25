// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command               = require( "../../../Structures/Command" )
// —— A powerful library for interacting with the Discord API
    , { MessageAttachment } = require( "discord.js" )
// —— node-canvas is a Cairo-backed Canvas implementation for Node.js.
    , Canvas                = require( "canvas" )
// —— FileSystem
    , fs                    = require( "fs" );

// ██████ | ███████████████████████████████████████████████████████████████████

// —— Create & export a class for the command that extends the base command
class Rank extends Command {

	constructor(client) {
		super(client, {
			name        : "rank",
			description : "Generates a custom card with progress, rank and biography",
			usage       : `rank { user }`,
			exemple     : [ "@asgarrrr" ],
			args        : false,
			category    : "Fun",
			cooldown    : 5,
			userPerms   : "SEND_MESSAGES",
			allowDMs    : false,
		});

	}

	async run( message, [ target ] ) {

        target = await this.client.utils.resolveMention( ( target || `<@${message.author.id}>` ), message.guild, 1 );

        if ( !target )
            return super.respond( this.language.notFound );

        const users = await this.client.db.Member.find({
            _guildID: message.guild.id,
        }).sort({ experience: "-1" });

        if ( !users )
            return super.respond( this.language.noCard );

        const user = users.find( ( user ) => user._ID === target.id )
            , rank = users.findIndex( ( user ) => user._ID === target.id ) + 1;

        // —— Creating a new canvas
        const canvas = Canvas.createCanvas( 1500, 500 )
        // —— Two-dimensional representation context
            , ctx    = canvas.getContext( "2d" );

        // —— Method for making rounded rect ( Thanks to @Corgalore )
        ctx.roundRect = function ( x, y, width, height, radius, fill, stroke ) {

            let cornerRadius = { upperLeft: 0, upperRight: 0, lowerLeft: 0, lowerRight: 0 };

            typeof stroke == "undefined" && ( stroke = true );

            if (typeof radius === "object") {
                for (var side in radius) {
                    cornerRadius[side] = radius[side];
                }
            }

            this.beginPath();
            this.moveTo( x + cornerRadius.upperLeft, y );
            this.lineTo( x + width - cornerRadius.upperRight, y );
            this.quadraticCurveTo( x + width, y, x + width, y + cornerRadius.upperRight );
            this.lineTo( x + width, y + height - cornerRadius.lowerRight );
            this.quadraticCurveTo( x + width, y + height, x + width - cornerRadius.lowerRight, y + height );
            this.lineTo( x + cornerRadius.lowerLeft, y + height );
            this.quadraticCurveTo( x, y + height, x, y + height - cornerRadius.lowerLeft );
            this.lineTo( x, y + cornerRadius.upperLeft );
            this.quadraticCurveTo( x, y, x + cornerRadius.upperLeft, y );
            this.closePath();
            stroke  && this.stroke();
            fill    && this.fill();
        }

        // —— Save the canvas context
        ctx.save();

        const DMSBoldPath = "./Assets/DMSans/DMSans-Bold.ttf"
            , DMSReguPath = "./Assets/DMSans/DMSans-Regular.ttf";

        // —— Import the fonts to use
        fs.existsSync( DMSBoldPath ) && Canvas.registerFont( DMSBoldPath, { family: "DM Sans", weight: "bold"     } );
        fs.existsSync( DMSReguPath ) && Canvas.registerFont( DMSReguPath, { family: "DM Sans", weight: "regular"  } );

        if ( !fs.existsSync( "./Assets/rankCards/base.png" ) ) {

            console.log( "The base image is missing, check that the path is present, otherwise, refer to the Github" );
            return;

        }

        // —— Loading the base image
        const base = await Canvas.loadImage( "./Assets/rankCards/base.png" );
        ctx.drawImage( base, 0, 0, canvas.width, canvas.height );

        // —— Draw the custom background if it exists
        try {

            if ( fs.existsSync( `./Assets/rankCards/${message.guild.id}-${target.user.id}.png` ) ) {

                // —— Draws custom background
                ctx.globalAlpha = 0.06;
                ctx.beginPath();
                ctx.roundRect( 45 + 35, 45, 1410 - 35, 410, { upperRight: 25, lowerRight: 25 }, false, false );
                ctx.closePath();
                ctx.clip();

                const customBackground = await Canvas.loadImage( `./Assets/rankCards/${message.guild.id}-${target.user.id}.png` );

                ctx.drawImage( customBackground, 45, 45, canvas.width , customBackground.height + 45 );

                ctx.restore();
                ctx.save();
                ctx.globalAlpha = 1;

            }

        } catch( err ) {

            console.error( err )
        }

        // —— clip the avatar area
        ctx.beginPath();
        ctx.arc( 126 + 158.5, 92 + 158.5, 158.5, 0, Math.PI * 2, true );
        ctx.closePath();
        ctx.clip();

        const avatar = await Canvas.loadImage( target.user.displayAvatarURL( { format: "jpg", dynamic: true, size: 4096 } ) );
	    ctx.drawImage( avatar, 126, 92, 317, 317 );

        ctx.restore();

        // —— Print username
        ctx.font = "bold 57px 'DM Sans'";
        ctx.fillStyle = "#ffffff";
        ctx.fillText( target.user.username, 482, 92 + 57 );

        // —— Print rank
        ctx.fillStyle = "#593EEF";
        ctx.fillText( rank, 1369 - ctx.measureText( rank ).width , 92 + 57 );

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 38px 'DM Sans'";

        ctx.globalAlpha = 0.2;
        ctx.fillText( "Rank" , 1345 - ctx.measureText( rank ).width - ctx.measureText( "Rank" ).width , 92 + 57 );
        ctx.globalAlpha = 1;

        ctx.font = "regular 31px 'DM Sans'";

        // —— Each line is ~32 characters long
        let prev  = 0
          , curr  = 32
          , clean = [];

        while ( user.bio[ curr ] ) {

            if ( user.bio[ curr++ ] == " " ) {
                clean.push( user.bio.substring( prev, curr ) );
                prev = curr;
                curr += 32;
            }

        }

        clean.push( user.bio.substr( prev ));

        clean.forEach( ( line, i ) => ctx.fillText( line, 482, 167 + 31 + ( i * 41 ) ) );

        // —— Creation of the experience progress bar
        const grd = ctx.createLinearGradient( 482, 349, 907, 59 );
        grd.addColorStop( 0, "#3621E4" );
        grd.addColorStop( 1, "#6F50F5" );
        ctx.lineWidth = 4;
        ctx.fillStyle = grd;
        ctx.strokeStyle = grd;

        ctx.beginPath();
        ctx.roundRect( 480, 347, 910, 63, { upperLeft: 32.5, upperRight: 32.5, lowerLeft: 32.5, lowerRight: 32.5 }, false, false );
        ctx.closePath();
        ctx.clip();

        ctx.roundRect( 482, 349, 907, 59, { upperLeft: 32.5, upperRight: 32.5, lowerLeft: 32.5, lowerRight: 32.5 }, false, true );
        ctx.roundRect( 482, 349, 907 * ( 0.1 * Math.sqrt( user.experience ) - user.level ) , 59, { upperLeft: 32.5, upperRight: 32.5, lowerLeft: 32.5, lowerRight: 32.5 }, true, false );

        ctx.font = "regular 38px 'DM Sans'";
        ctx.fillStyle = "#ffffff";
        ctx.fillText( `Lvl. ${ user.level }`, 505, 355 + 36 );

        ctx.font = "regular 31px 'DM Sans'";

        const progression = ` ${user.experience} / ${Math.pow( ( user.level + 1 ) / 0.1, 2 )}`;

        ctx.fillText( progression, 1369 - ctx.measureText( progression ).width, 356 + 33 );

	    message.channel.send( new MessageAttachment( canvas.toBuffer(), "card.png" ) );

    }
}

module.exports = Rank;