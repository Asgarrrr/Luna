// ██████ Integrations █████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API
const { Structures } = require("discord.js");

// ██████ | ███████████████████████████████████████████████████████████████████

Structures.extend( "Guild", ( Guild ) => class extends Guild {

    constructor( client, data ) {

        super( client, data );

        this.player = {
            _queue       : [],
            _oldQueue    : [],
            _connection  : null,
            _dispatcher  : null,
            _isPlaying   : false,
            _volume      : 1,
            _embedMsg    : null,
            _embed       : null,
            _loop        : false,
            _ttl         : [0, 0],
            reset        : () => {

                this.player._embedMsg.delete().catch( ( err ) => err );

                this.player._queue      = [];
                this.player._oldQueue   = [];
                this.player._connection = null;
                this.player._dispatcher = null;
                this.player._isPlaying  = false;
                this.player._volume     = 1;
                this.player._embedMsg   = null;
                this.player._embed      = null;
                this.player._loop       = false;
                this.player._ttl        = [0, 0];
            }
        };

        this.client.db.Guild.findOneAndUpdate({
            _ID : data.id
        }, {} , {
            setDefaultsOnInsert : true,
            upsert              : true,
            new                 : true,
        }).exec().then( ( res ) => {

            this.language           = res.language;
            this.plugins            = res.plugins;
            this.prefix             = res.prefix;
            this.disabledCommands   = res.disabled;

        });

    }
});