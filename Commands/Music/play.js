// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command           = require( "../../Structures/Command" );
// —— A ytdl-core wrapper focused on efficiency for use in Discord music bots
const ytdl              = require( "ytdl-core-discord" )
// —— Simple js only package to resolve YouTube Playlists
    , ytpl              = require( "ytpl" )
// —— Simple js only package to search for Youtube for Videos, Playlists and many more
    , ytsr              = require( "ytsr" )
// —— Download Soundcloud tracks with Node.js
    , scdl              = require( "soundcloud-downloader" ).default
// —— Get metadata for a spotify url without spotify API access
    , { getPreview,
        getTracks }     = require( "spotify-url-info" )
// —— A fast and easy API to create a buttons in discord using discord.js
    , { MessageButton } = require( "discord-buttons" );

// ██████ | ███████████████████████████████████████████████████████████████████

// —— Create & export a class for the command that extends the base command
class Play extends Command {

	constructor( client ) {
		super( client, {
			name        : "play",
			description : "If you are in a vocal channel, call Luna to play music from a supported url ( Youtube, Soundcloud, Spotify ).",
			usage       : "play [ url ] OR [ Something to search on YouTube ]",
			example     : ["play https://www.youtube.com/watch?v=5qap5aO4i9A", "play lofi mix", "play https://open.spotify.com/playlist/0vvXsWCC9xrXsKd4FyS8kM?si=c7b5911fb9ab45bc"],
			args        : true,
			category    : "Music",
			cooldown    : 1000,
            aliases     : ["p"],
			userPerms   : "CONNECT",
			allowDMs    : false,
		} );

	}

    async run( message, [ ...source ] ) {

        this.query  = source.join( " " );
        this.player = message.guild.player;

        // —— Check if the user is connected to a voice channel
        if ( !message.member.voice.channel )
            return super.respond( this.language.notInVoice );

        // —— Checks if Luna and the user are in the same channel
        if (
            this.player._connection
            && message.guild.me.voice.channel
            && !message.guild.me.voice.channel.members.has( message.author.id )
            && message.guild.me.voice.channel.members.size > 1
        )
        return super.respond( this.language.busy );

        // —— Connecting to a voice channel
        try {
            this.player._connection = await message.member.voice.channel.join();
        } catch ( error ) {
            return super.respond( this.language.cantJoin );
        }

        // —— If the url matches that of YouTube ...
        if ( this.query.match( /^(http|https)?(:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/?(?:|embed\/|v\/|playlist\?|watch\?v=|watch\?.+(?:&|&#38;);v=)/ ) ) {

            await ( this.query.includes( "list=" )
                ? this.youtubePlaylist()
                : this.youtube() );

        } else if ( this.query.match( /^(http|https)?:\/\/(soundcloud\.com|snd\.sc)\/(.*)\// ) ) {

            await ( this.query.includes( "/sets/" )
                ? this.soundCloudPlaylist()
                : this.soundCloud() );

        } else if ( this.query.match( /^(?:spotify:|(?:https?:\/\/(?:open|play)\.spotify\.com\/))(?:embed)?\/?(album|track|playlist)(?::|\/)((?:[0-9a-zA-Z]){22})/ ) ) {

            await ( !this.query.includes( "track" )
                ? this.spotifyPlaylist()
                : this.spotify() );

        } else {

            if ( await this.search() === "exit" )
                return;

        }

        if ( !this.player._embed )
            await this.embedPlayer( );

        // —— If a dispatcher has not been created and an element is available in the queue, create it
        if ( !this.player._dispatcher && this.player._queue.length > 0 )
            await this.play();

    }

    async youtube( ) {

        try {

            // —— Get metainfo from a video
            const { videoDetails } = await ytdl.getBasicInfo( this.query );

            if ( !videoDetails )
                return super.respond( this.language.notFound );

            this.player._queue.push({
                id      : videoDetails.videoId,
                length  : !isNaN( videoDetails.lengthSeconds ) && parseInt( videoDetails.lengthSeconds, 10 ),
                title   : videoDetails.title,
                url     : videoDetails.video_url,
                author  : {
                    name : videoDetails.author.name,
                    url  : videoDetails.author.user_url
                },
                live    : videoDetails.isLive || videoDetails.isLiveContent,
                thumb   : videoDetails.thumbnails[0].url,
                source  : "youtube",
                // —— Only related to Youtube
                //media   :
            });

            super.respond( { embed : {
                author      : {
                    name    : videoDetails.author.name,
                    url     : videoDetails.author.channel_url,
                },
                title       : videoDetails.title,
                description : this.language.embedDesc( this.message, this.client.utils.formatTime( videoDetails.lengthSeconds ) ),
                url         : videoDetails.video_url,
                color       : "0x7354f6",
            }} );

        } catch ( error ) {

            super.respond( this.language.incorrect );

        }

    }

    async youtubePlaylist( ) {

        // —— Get the X videos of the playlist
        const playlist = await ytpl( this.query, { limit: Infinity } ).catch( ( err ) => err );

        // —— If the playlist is not valid ( or if it's a mix )
        if ( playlist instanceof Error )
            return super.respond( playlist.message === "Mixes not supported"
                ? this.language.mix : this.language.cantGetPlst );

        let playlistTime = { live : 0, video : 0 };

        for ( const video of playlist.items ) {

            this.player._queue.push({
                id      : video.id,
                length  : video.durationSec,
                title   : video.title,
                url     : video.shortUrl,
                author  : {
                    name : video.author.name,
                    url  : video.author.url
                },
                live    : video.isLive,
                thumb   : video.thumbnails[0].url,
                source  : "youtube"
            });

            video.isLive ? playlistTime.live++ : playlistTime.video += video.durationSec;

        }

        super.respond({ embed : {
            author      : {
                name    : playlist.author && playlist.author.name,
                url     : playlist.author && playlist.author.url,
            },
            title       : playlist.title,
            description : this.language.embedDescPl( this.message, playlist.items.length, this.client.utils.formatTime( playlistTime.video ), playlistTime.live ),
            url         : playlist.url,
            color       : "0x7354f6",
        }});

    }

    async soundCloud( ) {

        try {
            // —— Get metainfo from a sound
            const track = await scdl.getInfo( this.query );

            if ( !track || track.streamable === false )
                return super.respond( this.language.cantPlay );

            this.player._queue.push({
                id      : track.id,
                length  : track.duration / 1000,
                title   : track.title,
                url     : track.permalink_url,
                author  : {
                    name : track.user.username,
                    url  : track.user.permalink_url
                },
                live    : false,
                thumb   : track.artwork_url,
                source  : "soundcloud",
            });

            super.respond( { embed : {
                author      : {
                    name    : track.user.username,
                    url     : track.user.permalink_url,
                },
                title       : track.title,
                description : this.language.embedDesc( this.message, this.client.utils.formatTime( track.duration / 1000 ) ),
                url         : track.permalink_url,
                color       : "0x7354f6",
            }} );

        } catch ( error ) {

            super.respond( this.language.notFound );

        }

    }

    async soundCloudPlaylist( ) {

        try {

            // —— Returns info about the given playlist
            const playlist = await scdl.getSetInfo( this.query );

            if ( !playlist.tracks.length )
                return super.respond( this.language.emptyPlst );

            let added = { element: 0, time: 0 };

            for ( const track of playlist.tracks ) {

                if ( track.streamable === false )
                    continue;

                this.player._queue.push({
                    id      : track.id,
                    length  : track.duration / 1000,
                    title   : track.title,
                    url     : track.permalink_url,
                    author  : {
                        name : track.user.username,
                        url  : track.user.permalink_url
                    },
                    live    : false,
                    thumb   : track.artwork_url,
                    source  : "soundcloud",
                });

                added.element++;
                added.time += track.duration / 1000;

            }

            super.respond({ embed : {
                author      : {
                    name    : playlist.user.username,
                    url     : playlist.user.permalink_url,
                },
                title       : playlist.title,
                description : this.language.embedDescPl( this.message, added.element, this.client.utils.formatTime( added.time ) ),
                url         : playlist.permalink_url,
                color       : "0x7354f6",
            }});

        } catch ( error ) {

            super.respond( this.language.notFound );

        }

    }

    async spotify( ) {

        try {

            // —— Return preview sound informations
            const { title, artist, link } = await getPreview( this.query );

            if ( !( title && artist ) )
                return super.respond( this.language.notFound );

            // —— Try to find a similar item on YouTube using the artist's name and title
            const query = await ytsr.getFilters( `${title} ${artist}` )
                , type  = query.get( "Type" ).get( "Video" );

            const { items } = await ytsr( type.url, { limit: 1 } );

            if ( !items.length )
                return super.respond( this.language.notFound );

            const item = items[0];

            const trackDuration = item.duration.split( ":" ).reduce( ( acc, time ) => ( 60 * acc ) + +time );

            this.player._queue.push({
                id      : item.id,
                length  : trackDuration,
                title   : item.title,
                url     : item.url,
                author  : {
                    name : artist,
                    url  : null
                },
                live    : item.isLive,
                thumb   : ( item.bestThumbnail && item.bestThumbnail.url ) || item.thumbnails[0] && item.thumbnails[0].url,
                source  : "spotify",
            });

            super.respond({ embed : {
                author      : {
                    name    : artist,
                    url     : null,
                },
                title,
                description : this.language.embedDesc( this.message, this.client.utils.formatTime( trackDuration ) ),
                url         : link,
                color       : "0x7354f6",
            }});

        } catch ( error ) {

            super.respond( this.language.notFound );

        }

    }

    async spotifyPlaylist( ) {

        try {

            let added = { element: 0, time: 0 };

            // —— Get preview sound informations and raw data we can scrape from spotify
            const [ playlist, data ] = await Promise.all([
                getTracks  ( this.query ),
                getPreview ( this.query )
            ]);

            // —— 💩
            for await ( const track of playlist.map( async ( track ) => {

                // —— Try to find a similar item on YouTube using the artist's name and title
                try {

                    if ( !track.is_local || !track.name || !track.artists[0].name ) {

                        const query = await ytsr.getFilters( `${track.name} ${track.artists[0].name}` )
                            , type  = query.get( "Type" ).get( "Video" );

                        const { items } = await ytsr( type.url, { limit: 1 } );

                        if ( items.length )
                            return items[0];

                    }

                } catch ( error ) { error; }

            }) ) {

                if ( !track )
                    continue;

                const trackDuration = track.duration.split( ":" ).reduce( ( acc, time ) => ( 60 * acc ) + +time );

                this.player._queue.push({
                    id      : track.id,
                    length  : trackDuration,
                    title   : track.title,
                    url     : track.url,
                    author  : {
                        name : track.author.name,
                        url  : track.author.url
                    },
                    live    : track.isLive,
                    thumb   : ( track.bestThumbnail && track.bestThumbnail.url ) || track.thumbnails[0] && track.thumbnails[0].url,
                    source  : "spotify",
                });

                added.element++;
                added.time += trackDuration;

            }

            super.respond({ embed : {
                author      : {
                    name    : track.author.name,
                    url     : track.author.url,
                },
                title       : data.title,
                description : this.language.embedDescPl( this.message, added.element, this.client.utils.formatTime( added.time ) ),
                url         : data.link,
                color       : "0x7354f6",
            }});


        } catch ( error ) {

            super.respond( this.language.notFound );

        }

    }

    async search( ) {

        try {

            // —— Searches for the given string
            const search    = await ytsr.getFilters( this.query )
            // —— Search only for videos or live
                , filter1   = search.get( "Type" ).get( "Video" )

                , { items } = await ytsr( filter1.url, { limit: 10 } );

            if ( !items.length )
                return super.respond( this.language.notFound );

            const resultList = items.map( ( video, i ) => {

                return [
                    ( ++i ).toString().padStart( 2 ).padEnd( 3 ),
                    ( video.duration || "Live" ).padEnd( 9 ),
                    video.title.length >= 48 ? video.title.substring( 0, 47 ) + "…" : video.title,
                ].join("│ ");

            });

            resultList.push("exit");

            const select = await this.message.channel.send("```" + resultList.join("\n") + "```");

            try {

                const collected = await this.message.channel.awaitMessages(
                    ( msg ) => ( msg.content > 0 && msg.content < resultList.length || msg.content === "exit" ) && msg.author.id === this.message.author.id,
                    { max: 1, time: 30000, errors: ["time"] } );

                let selected = collected.first().content;

                if ( selected === "exit" )
                    return select.delete().catch( ( err ) => err ) && "exit";

                selected = items[parseInt( selected, 10 ) - 1];

                const trackDuration = !selected.isLive && selected.duration.split( ":" ).reduce( ( acc, time ) => ( 60 * acc ) + +time );

                this.player._queue.push({
                    id      : selected.id,
                    length  : trackDuration,
                    title   : selected.title,
                    url     : selected.url,
                    author  : {
                        name : selected.author.name,
                        url : selected.author.url
                    },
                    live    : selected.isLive,
                    thumb   : ( selected.bestThumbnail && selected.bestThumbnail.url ) || selected.thumbnails[0] && selected.thumbnails[0].url,
                    source  : "youtube",
                });

                super.respond({ embed : {
                    author      : {
                        name    : selected.author.name,
                        url     : selected.author.url,
                    },
                    title       : selected.title,
                    description : this.language.embedDesc( this.message, this.client.utils.formatTime( trackDuration ) ),
                    url         : selected.url,
                    color       : "0x7354f6",
                }});

                collected.first().delete().catch( ( err ) => err );
                select.delete().catch( ( err ) => err );

            } catch ( error ) {

                select.delete().catch( ( err ) => err );

            }

        } catch ( error ) {

            super.respond( this.language.error );

        }


    }

    async play( ) {

        if ( !this.player._queue[0] )
            return super.respond( this.language.emptyPlst );

        const track = this.player._queue[0];

        switch ( track.source ) {

            case "spotify":
            case "youtube": {

                const options = {
                    quality         : "highestaudio",
                    opusEncoded     : true,
                    dlChunkSize     : 0,
                    highWaterMark   : 1 << 25,
                };

                try {

                    const songInfo = await ytdl.getInfo( track.id );

                    if ( !songInfo )
                        return super.respond ( this.language.notFound );

                    if ( track.isLive ) {

                        const hlsFormats     = ytdl.filterFormats( songInfo.formats, ( format ) => format.isHLS )
                            , topFormatLabel = hlsFormats[0].qualityLabel
                        // —— Remove the p from qualityLabel and cast to number
                            , rawQuality     = parseInt( topFormatLabel.slice( 0, topFormatLabel.length - 1 ), 10 );

                            // —— If the video quality is higher than 720p, then we wanna make sure to get the highest audio quality from the lowest possible video quality
                            options.filter = ( format ) => rawQuality > 720
                                ? format.isHLS && format.qualityLabel === "720p"
                                : format.isHLS;

                    } else options.filter = "audioonly";

                    // —— Attempts to download a video from the given url. Returns a readable stream.
                    const stream = await ytdl( this.player._queue[0].url, options );

                    // —— Play an audio ReadableStream.
                    this.player._dispatcher = this.player._connection.play( stream, {
                        type        : "opus",
                        bitrate     : "auto",
                    });

                } catch ( error ) {

                    super.respond( this.language.notFound );
                    return this.player._queue.shift();

                }


            } break;

            case "soundcloud" : {

                try {

                    const trackData = await scdl.getInfo( this.player._queue[0].url );

                    if ( !trackData )
                        return super.respond( this.language.notFound );

                    const { transcodings } = trackData.media;

                    // —— Look for the best encoding
                    const best = transcodings
                        .filter( ( x ) => x.format.protocol  === "hls" )
                        .filter( ( x ) => x.format.mime_type === "audio/ogg; codecs=\"opus\"" );

                    // —— Gets the audio from the given URL, returns a ReadableStream.
                    const stream = await scdl.downloadFormat( this.player._queue[0].url, best.length ? scdl.FORMATS.OPUS : scdl.FORMATS.MP3 );

                    // —— Play an audio ReadableStream.
                    this.player._dispatcher = this.player._connection.play( stream );

                } catch ( error ) {

                    super.respond( this.language.notFound );
                    return this.player._queue.shift();

                }

            } break;

            default:
                break;

        }

        if ( !this.player._dispatcher )
            return;

        this.player._dispatcher.on( "start", async ( ) => {

            this.player._isPlaying = true;
            await this.embedPlayer( );

        });

        this.player._dispatcher.on( "error", ( error ) => {

            this.player._dispatcher.end();
            this.message.channel.send( this.language.error )

        });

        this.player._dispatcher.on( "finish", ( ) => {
            // —— If there are still items to play at the end of the current item, and the repeat mode is not enabled, the item is removed from the queue and goes into the "queue history".
            if ( this.player._queue.length > 1 ) {
                // —— If the repeat mode is not activated, the track that has just been played will be moved to the tracks already played
                !this.player._loop && this.player._oldQueue.unshift( this.player._queue.shift() );
                // —— Read the following track
                this.play();

            } else {

                // —— Reset the player
                this.player.reset();

                // —— Leave the voice channel
                this.message.guild.me.voice.channel
                && this.message.guild.me.voice.channel.leave();

            }

        });
    }

    async embedPlayer( ) {

        if ( !this.player._embed ) {

            // —— Create interaction buttons
            const emoji = [ "⏮️", "⏹️", "⏯️", "⏭️", "🔁" ];
            const buttons = emoji.map( ( e ) => new MessageButton().setStyle( "gray" ).setLabel(" ").setID( e ).setEmoji( e ) );

            // —— Since the media is playing, the emoji should be the one to pause
            buttons[2].setEmoji("⏸️");
            buttons[4]
                .setEmoji( this.player._loop ? "🔁" : "🔂" )
                .setStyle( this.player._loop ? "blurple" : "gray" );

            this.player._embed = {
                author      : {
                    name : this.language.now,
                },
                title       : this.player._queue[0].title,
                url         : this.player._queue[0].url,
                description : `[${this.player._queue[0].author.name}](${this.player._queue[0].author.url})`,
                thumbnail   : {
                    url : this.player._queue[0].thumb,
                },
                footer      : {
                    text : this.player._loop ? this.language.loop : ""
                }
            };

            this.player._embedMsg = await super.respond({ embed: this.player._embed , buttons });

            this.player._embedMsg.createButtonCollector(
                ( button ) => {
                    if (this.player._connection
                        && this.player._connection.channel.members.has( button.clicker.user.id )
                        && button.clicker.user.id !== this.player._embedMsg.author.id
                        && emoji.some( ( react ) => react === button.id ))
                        return true;
                }, { time: 10800000 }

            ).on( "collect", async ( button ) => {

                // —— Get the related command
                const cname = [ "back", "stop", "pause", "skip", "loop" ][ emoji.indexOf( button.id ) ]
                // —— Get the command
                    , command = this.client.commands.get( cname );
                // —— Set message and local
                command.setMessage( this.message );
                // —— Run the command
                command.run( this.message );

                buttons[2].setEmoji( this.player._isPlaying ? "⏸️" : "▶️" );
                buttons[4]
                    .setEmoji( this.player._loop ? "🔁" : "🔂" )
                    .setStyle( this.player._loop ? "blurple" : "gray" );

                await this.player._embedMsg.edit({ buttons });
                await button.defer();

            }).on( "end", ( collected ) => {

                this.player._embedMsg && this.player._embedMsg.delete().catch( ( err ) => err );
                this.player._embedMsg = null;
                this.player._embed    = null;

            });

        } else {

            this.player._embedMsg.edit( { embed: {
                author      : {
                    name : this.language.now,
                },
                title       : this.player._queue[0].title,
                url         : this.player._queue[0].url,
                description : `[${this.player._queue[0].author.name}](${this.player._queue[0].author.url})`,
                thumbnail   : {
                    url : this.player._queue[0].thumb,
                },
                footer      : {
                    text : this.player._loop ? this.language.loop : ""
                }
            }});

        }

    }

}

module.exports = Play;