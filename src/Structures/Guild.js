// ██████ Integrations █████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API
const { Structures } = require("discord.js");

// ██████ | ███████████████████████████████████████████████████████████ | ██████

Structures.extend("Guild", (Guild) => class extends Guild {

    constructor(client, data) {

        super(client, data);

        this.player = {
            _queue       : [],
            _connection  : null,
            _dispatcher  : null,
            _isPlaying   : false,
            _volume      : 1,
            _embed       : {},
            _loop        : false,
            _ttl         : [0, 0],
        };

        const guildData = this.client.db.prepare("SELECT * FROM Guilds WHERE _ID = ?").get(data.id);

        if (!guildData)
            this.client.db.prepare("INSERT INTO Guilds('_ID') Values(?)").run(data.id);

        const { local,
                logChan } = guildData;

        this.local   = local || "English";
        this.logchan = logChan;


    }
});