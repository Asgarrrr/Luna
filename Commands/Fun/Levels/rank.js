// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command               = require( "../../../Structures/Command" )
// —— A powerful library for interacting with the Discord API
    , { MessageAttachment } = require( "discord.js" )
// —— Identifying emoji entities within a string in order to render them as Twemoji
    , { parse }             = require( "twemoji-parser" )
// —— node-canvas is a Cairo-backed Canvas implementation for Node.js.
    , Canvas                = require( "canvas" )
// —— FileSystem
    , fs                    = require( "fs" );

/* —— | ———————————————————————————————————————————————————————————————————————
    Loading fonts - Why these specifically? I don't know, the host on which
    I host Luna doesn't have a default font, for the nicknames with special characters,
    I had to use these ones, depending on the problems I encountered */

    // ERROR: AppleSymbol.ttf seems not a valid font - Twiistrz

    const DMSBoldPath  = "./Assets/Fonts/DMSans-Bold.ttf"
        , DMSReguPath  = "./Assets/Fonts/DMSans-Regular.ttf"
        , STIXGeneral  = "./Assets/Fonts/STIXGeneral.ttf"
        // , AppleSymbol  = "./Assets/Fonts/AppleSymbol.ttf"
        , Arial        = "./Assets/Fonts/Arial.ttf"
        , ArialUnicode = "./Assets/Fonts/ArialUnicode.ttf";

    // —— Import the fonts to use
    fs.existsSync( DMSBoldPath  ) && Canvas.registerFont( DMSBoldPath , { family: "DM Sans", weight: "bold" } );
    fs.existsSync( DMSReguPath  ) && Canvas.registerFont( DMSReguPath , { family: "DM Sans", weight: "regular" } );
    fs.existsSync( STIXGeneral  ) && Canvas.registerFont( STIXGeneral , { family: "STIXGeneral" } );
    // fs.existsSync( AppleSymbol  ) && Canvas.registerFont( AppleSymbol , { family: "AppleSymbol" } );
    fs.existsSync( Arial        ) && Canvas.registerFont( Arial       , { family: "Arial" } );
    fs.existsSync( ArialUnicode ) && Canvas.registerFont( ArialUnicode, { family: "ArielUnicode" } );

    const Fonts = "'DM Sans', STIXGeneral, AppleSymbol, Arial, ArialUnicode";


// ██████ | ███████████████████████████████████████████████████████████████████

// —— Create & export a class for the command that extends the base command
class Rank extends Command {

	constructor(client) {
		super(client, {
			name        : "rank",
			description : "Generates a custom card with progress, rank and biography",
			usage       : "rank { user }",
			example     : [ "@asgarrrr" ],
			args        : false,
			category    : "Fun",
			cooldown    : 5,
			userPerms   : "SEND_MESSAGES",
			guildOnly   : true,
		});

	}

	async run( message, [ target ] ) {

        target = await this.client.utils.resolveMention( ( target || `<@${message.author.id}>` ), message.guild, 1 );

        if ( !target )
            return super.respond( this.language.notFound );

        // —— Search or create member
        const user = await this.client.db.Member.findOneAndUpdate({
            _ID     : target.id,
            _guildID: message.guild.id,
        }, {}, {
            setDefaultsOnInsert : true,
            upsert              : true,
            new                 : true,
        });

        if ( !user )
            return super.respond( this.language.missInfo );

        // —— Get the top 10 members of the ranking, sorted by experience
        const ranking = await this.client.db.Member.find({
            _guildID: message.guild.id,
        }).sort({ experience: "-1" });

        const rank = ranking.findIndex( ( user ) => user._ID === target.id ) + 1;

        if ( isNaN( user.experience ) || !user.level || !user.bio )
            return super.respond( this.language.missInfo );

        // —— Creating a new canvas
        const canvas = Canvas.createCanvas( 1500, 500 )
        // —— Two-dimensional representation context
            , ctx    = canvas.getContext( "2d" );

        // —— Method for making rounded rect ( Thanks to @Corgalore )
        ctx.roundRect = function ( x, y, width, height, radius, fill, stroke ) {

            let cornerRadius = { upperLeft: 0, upperRight: 0, lowerLeft: 0, lowerRight: 0 };

            typeof stroke == "undefined" && ( stroke = true );

            if ( typeof radius === "object" )
                for ( let [ key ] of Object.entries( radius ) )
                    cornerRadius[key] = radius[key];

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
        };

        // —— Save the canvas context
        ctx.save();

        if ( !fs.existsSync( "./Assets/rankCards/base.png" ) ) {

            console.log( "The base image is missing, check that the path is present, otherwise, refer to the Github" );
            return;

        }

        // —— Loading the base image
        const base = await Canvas.loadImage( "./Assets/rankCards/base.png" );
        ctx.drawImage( base, 0, 0, canvas.width, canvas.height );

        // —— Draw the custom background if it exists
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
            console.error( err );
        }

        // —— clip the avatar area
        ctx.beginPath();
        ctx.arc( 126 + 158.5, 92 + 158.5, 158.5, 0, Math.PI * 2, true );
        ctx.closePath();
        ctx.clip();

        const avatar = await Canvas.loadImage( target.user.displayAvatarURL( { format: "jpg", dynamic: true, size: 4096 } ) );
        ctx.drawImage( avatar, 126, 92, 317, 317 );

        ctx.restore();

        let currWidth = 0;

        // —— Print username
        ctx.font = `bold 57px ${Fonts}`;
        ctx.fillStyle = "#ffffff";

        let fontSize = 57;

        const name = ( target.nickname || target.user.username );

        // —— Recalculate the font size so that the text does not exceed max size
        while ( ctx.measureText( name ).width > 700 )
            ctx.font = `bold ${ fontSize-- }px ${Fonts}`;

        for ( const character of name ) {

            const parseEmoji = parse( character );

            if ( parseEmoji.length ) {

                const img = await Canvas.loadImage( parseEmoji[0].url );

                ctx.drawImage( img, 482 + currWidth, 149 - fontSize + 10, fontSize - 3, fontSize - 3 );

                currWidth += fontSize;

            } else {

                ctx.fillText( character, 482 + currWidth, 149 );
                currWidth += ctx.measureText( character ).width;

            };

        }

        // —— Print rank
        ctx.fillStyle = "#593EEF";
        ctx.font = `bold 57px ${Fonts}`;
        ctx.fillText( rank, 1369 - ctx.measureText( rank ).width , 92 + 57 );

        ctx.fillStyle = "#ffffff";
        ctx.font = `bold 38px ${Fonts}`;

        ctx.globalAlpha = 0.2;
        ctx.fillText( "Rank" , 1345 - ctx.measureText( rank ).width - ctx.measureText( "Rank" ).width , 92 + 57 );
        ctx.globalAlpha = 1;

        ctx.font = `regular 31px ${Fonts}`;

        if ( user.bio === "NoBioSet" )
            user.bio = this.language.noBio( message.guild.prefix );

        // —— Each line is ~32 characters long — Max 40, force split
        let prev  = 0
          , curr  = 32
          , clean = [];

        while ( user.bio[ curr ] ) {

            if ( user.bio[ curr++ ] === " " ) {

                clean.push( user.bio.substring( prev, curr ) );
                prev = curr;
                curr += 32;

            } else if( curr - prev >= 39 ) {

                clean.push( user.bio.substring( prev, curr ) + "-"  );
                prev = curr;
                curr += 40;

            }

        }

        clean.push( user.bio.substr( prev ));

        for ( let [ i , line ] of clean.entries() ) {

            currWidth = 0;

            for ( const character of line ) {

                const parseEmoji = parse( character );

                if ( parseEmoji.length && parseEmoji[0].url ) {

                    const img = await Canvas.loadImage( parseEmoji[0].url );

                    ctx.drawImage( img, 482 + currWidth, 175 + ( i * 41 ), 28, 28 );

                    currWidth += 28;

                } else {

                    ctx.fillText( character, 482 + currWidth, 167 + 31 + ( i * 41 ) );
                    currWidth += ctx.measureText( character ).width;

                }

            }

        }

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

        ctx.font = `regular 38px ${Fonts}`;
        ctx.fillStyle = "#ffffff";
        ctx.fillText( `Lvl. ${ user.level }`, 505, 355 + 36 );

        ctx.font = `regular 31px ${Fonts}`;

        const progression = ` ${user.experience} / ${Math.pow( ( user.level + 1 ) / 0.1, 2 )}`;

        ctx.fillText( progression, 1369 - ctx.measureText( progression ).width, 356 + 33 );

        message.channel.send( new MessageAttachment( canvas.toBuffer(), "card.png" ) );

    }
}

module.exports = Rank;