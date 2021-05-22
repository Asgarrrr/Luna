// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command = require( "../../Structures/Command" );

// ██████ | ███████████████████████████████████████████████████████████████████

// —— Create & export a class for the command that extends the base command
class nowplaying extends Command {

	constructor( client ) {
		super( client, {
			name        : "nowplaying",
			description : "Show information about the current track",
			usage       : "nowplaying",
			args        : false,
			category    : "Music",
			cooldown    : 1000,
            aliases     : ["np"],
			userPerms   : "CONNECT",
			allowDMs    : false,
		} );

	}

    async run( message ) {

        const player = message.guild.player;

        // —— Check that the playlist is not empty
        if ( !player._queue.length )
            return super.respond( this.language.nothing );

        // —— Shortcut to the first item in the playlist
        const nowP         = player._queue[0]
        // —— The time (in milliseconds) that the dispatcher has been playing audio for, taking into account skips and pauses
            , currentTime  = ( player._dispatcher.totalStreamTime - player._dispatcher.pausedTime ) / 1000
        // —— Creation of a array filled with "-".
            , bar          = new Array( 50 - ( currentTime.toString().length +  nowP.length.toString().length ) ).fill( "—" )
        // —— Normalization to hh:mm:ss format
            , fCurrentTime = this.client.utils.formatTime( currentTime )
            , fTotalTime   = this.client.utils.formatTime( nowP.length );

        // —— Places a character at the current playback position
        bar[ ( currentTime / nowP.length * bar.length ).toFixed( 0 ) ] = "o";

        // —— Creation of the indicative embed
        const embed = {
            title       : nowP.title,
            url         : nowP.url,
            author      : { name : this.language.nowPlaying, },
            description : [
                `[${nowP.author.name}](${nowP.author.url})`,
                `\`\`\`${ fCurrentTime } ${ bar.join("") } ${ fTotalTime === "0:00" ? "Live" : fTotalTime }\`\`\``,
            ].join( "\n" ),
            color       : "0x7354f6",
        };

        // —— If there is more than one track to play
        if ( player._queue.length > 1 ) {

            // —— List of the next 5 items to read
            const next = player._queue.slice( 1, 6 ).map( ( track, i ) => {

                return [
                    ( ++i ).toString().padStart( 2 ).padEnd( 3 ),
                    ( this.client.utils.formatTime( track.length ) || "Live" ).padEnd( 9 ),
                    track.title.length >= 35 ? track.title.substring( 0, 35 ) + "…" : track.title,
                ].join("│ ");

            });

            // —— Adds the previously created list to the embed
            embed.fields = [{
                name  : this.language.nextTracks,
                value : `\`\`\`${next.join("\n")}\`\`\``
            }];

        }

        // —— Sending the embed
        super.respond( { embed } );

    }

}

module.exports = nowplaying;