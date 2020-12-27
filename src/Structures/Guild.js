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

        let guildData;

        if (!(guildData = this.client.db.prepare("SELECT * FROM Guilds WHERE _ID = ?").get(data.id))) {
            this.client.db.prepare("INSERT INTO Guilds('_ID') Values(?)").run(data.id);
            guildData = {
                Local   : "English",
                logChan : null
            }
        }

        this.local   = guildData.Local || "English";
        this.logchan = guildData

    }
});