// ██████ Integrations █████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API
const { Structures } = require("discord.js");

// ██████ | ███████████████████████████████████████████████████████████████████

Structures.extend("Guild", (Guild) => class extends Guild {

    constructor(client, data) {

        super(client, data);

        this.player = {
            _queue       : [],
            _oldQueue    : [],
            _connection  : null,
            _dispatcher  : null,
            _isPlaying   : false,
            _volume      : 1,
            _embed       : {},
            _loop        : false,
            _ttl         : [0, 0],
        };

        this.client.db.Guild.findOneAndUpdate({
            _ID : data.id
        }, {} , {
            setDefaultsOnInsert : true,
            upsert              : true,
            new                 : true,
        }).exec().then( ( res ) => {

            this.local              = res.language;
            this.plugins            = res.plugins;
            this.prefix             = res.prefix;
            this.disabledCommands   = res.disabled;

        });

    }
});