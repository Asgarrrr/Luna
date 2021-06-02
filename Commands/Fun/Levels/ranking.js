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

    const DMSBoldPath  = "./Assets/Fonts/DMSans-Bold.ttf"
        , DMSReguPath  = "./Assets/Fonts/DMSans-Regular.ttf"
        , STIXGeneral  = "./Assets/Fonts/STIXGeneral.ttf"
        , AppleSymbol  = "./Assets/Fonts/AppleSymbol.ttf"
        , Arial        = "./Assets/Fonts/Arial.ttf"
        , ArialUnicode = "./Assets/Fonts/ArialUnicode.ttf";

    // —— Import the fonts to use
    fs.existsSync( DMSBoldPath  ) && Canvas.registerFont( DMSBoldPath , { family: "DM Sans", weight: "bold" } );
    fs.existsSync( DMSReguPath  ) && Canvas.registerFont( DMSReguPath , { family: "DM Sans", weight: "regular" } );
    fs.existsSync( STIXGeneral  ) && Canvas.registerFont( STIXGeneral , { family: "STIXGeneral" } );
    fs.existsSync( AppleSymbol  ) && Canvas.registerFont( AppleSymbol , { family: "AppleSymbol" } );
    fs.existsSync( Arial        ) && Canvas.registerFont( Arial       , { family: "Arial" } );
    fs.existsSync( ArialUnicode ) && Canvas.registerFont( ArialUnicode, { family: "ArielUnicode" } );

    const Fonts = "'DM Sans', STIXGeneral, AppleSymbol, Arial, ArialUnicode"


// ██████ | ███████████████████████████████████████████████████████████████████

// ██████ | ███████████████████████████████████████████████████████████████████

// —— Create & export a class for the command that extends the base command
class Ranking extends Command {

	constructor(client) {
		super(client, {
			name        : "ranking",
			description : "Displays the top 10 ranking of the server members",
			usage       : "ranking",
			args        : false,
			category    : "Fun",
			cooldown    : 5,
			userPerms   : "SEND_MESSAGES",
			allowDMs    : false,
		});

	}

	async run( message ) {

        // —— Collect the 10 members with the most experience, and organize them in descending order
        const ranking = await this.client.db.Member.find({
            _guildID: message.guild.id
        }).sort({ experience: "-1" }).limit( 10 );

        // —— If there are no members in the database
        if ( !ranking )
            return super.respond( this.language.null );

        // —— Creating a new canvas
        const canvas = Canvas.createCanvas( 1410, 2717 )
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

        // —— Drawing of the main rect
        ctx.fillStyle = "#202225";
        ctx.beginPath();
        ctx.roundRect( 0, 0, canvas.width, canvas.height, { upperLeft: 32.5, upperRight: 32.5, lowerLeft: 32.5, lowerRight: 32.5 } , true );
        ctx.closePath();
        ctx.clip();

        // —— Looking for the first member with a banner
        const firstWithBanner = ranking.find( ( member ) => {

            const path = `./Assets/rankCards/${member._guildID}-${member._ID}.png`;

            try {

                if ( fs.existsSync( path ) )
                    return true;

            } catch ( err ) { ( err ) => err; }

        });

        // —— if a banner has been found, it will be used as a presentation
        if ( firstWithBanner ) {

            // —— Loading and drawing the image
            const banner = await Canvas.loadImage( `./Assets/rankCards/${firstWithBanner._guildID}-${firstWithBanner._ID}.png` );
            ctx.globalAlpha = 0.08;
            ctx.drawImage( banner, 0, 0, canvas.width , banner.height - 20 );
            ctx.globalAlpha = 1;

        }

        const grd = ctx.createLinearGradient(0, 0, canvas.width, 0);
        grd.addColorStop( 0, "#3621E4" );
        grd.addColorStop( 1, "#6F50F5" );
        ctx.fillStyle = grd;
        ctx.fillRect( 0, 470, 1410, 16 );

        const trophy = await Canvas.loadImage( "./Assets/trophy.svg" );
        ctx.drawImage( trophy, 102, 134, 203 , 203 );

        ctx.font = `bold 80px ${Fonts}`;
        ctx.fillStyle = "#ffffff";
        ctx.fillText( message.guild.name, 368, 238 );

        ctx.font = `regular 54px ${Fonts}`;
        ctx.fillStyle = "#838485";
        ctx.fillText( "LEADERBOARD", 368, 312 );

        let init = 571;

        // —— Iteration through the members
        for ( const member of ranking ) {

            ctx.fillStyle = "#161616";

            ctx.save();
            ctx.beginPath();
            ctx.roundRect( 102, init, 1207, 183, { upperLeft: 32.5, upperRight: 32.5, lowerLeft: 32.5, lowerRight: 32.5 } , true );
            ctx.closePath();
            ctx.clip();

            const path = `./Assets/rankCards/${member._guildID}-${member._ID}.png`;

            if ( fs.existsSync( path ) ) {

                const banner = await Canvas.loadImage( path );
                ctx.globalAlpha = 0.08;
                ctx.drawImage( banner, 102 , init, 1207 , banner.height );
                ctx.globalAlpha = 1;

            }

            ctx.restore();
            ctx.save();

            // —— clip the avatar area
            ctx.beginPath();

            ctx.arc( 131 + 70.5, init + 21 + 70.5, 70.5, 0, Math.PI * 2, true );
            ctx.closePath();
            ctx.clip();

            const userData = message.guild.members.cache.get( member._ID )
            || { user: await this.client.users.fetch( member._ID ) };

            const avatar = await Canvas.loadImage( userData.user.displayAvatarURL( { format: "jpg", dynamic: true, size: 4096 } ) );
            ctx.drawImage( avatar, 131, init + 21, 141, 141 );

            ctx.restore();

            const nbr = await this.client.db.Message.countDocuments({
                _userID     : userData.user.id,
                _guildID    : message.guild.id
            });

            ctx.font = `bold 50px ${Fonts}`;
            ctx.fillStyle = "#ffffff";

            let fontSize = 50;

            // —— Recalculate the font size so that the text does not exceed max size
            while ( ctx.measureText( userData.nickname || userData.user.username ).width > 830 )
                ctx.font = `bold ${ fontSize-- }px ${Fonts}`;

            let currWidth = 0;

            // —— For each letter of the nickname
            for ( const character of userData.nickname || userData.user.username ) {

                // —— Determine if it is an emoji or a "classic" character
                // —— Get the information, including a link to the emoji in svg
                const parseEmoji = parse( character );

                if ( parseEmoji.length ) {

                    const img = await Canvas.loadImage( parseEmoji[0].url );

                    ctx.drawImage( img, 313 + currWidth, init + 80 - fontSize + 10, fontSize - 3, fontSize - 3 );

                    currWidth += fontSize;

                } else {

                    ctx.fillText( character, 313 + currWidth, init + 80 );
                    currWidth += ctx.measureText( character ).width;

                };

            }

            ctx.font = `bold 35px ${Fonts}`;
            ctx.fillStyle = "#808080";
            ctx.fillText( `Level ${ String( member.level ).padEnd( 6, " ") }${ nbr } messages`  , 313, init + 130 );

            ctx.font = `bold 80px ${Fonts}`;
            ctx.fillStyle = "#6446F2";
            ctx.fillText( ranking.indexOf( member ) + 1, 1219 - ctx.measureText( ranking.indexOf( member ) + 1 ).width , init + 120 );

            init = init + 183 + 25;

        }

       super.respond( new MessageAttachment( canvas.toBuffer(), "card.png" ) );

    }
}

module.exports = Ranking;