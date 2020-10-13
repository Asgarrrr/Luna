// ██████ Integrations █████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API
const { Structures } = require('discord.js');

// ██████ | ███████████████████████████████████████████████████████████ | ██████

Structures.extend("Guild", (Guild) => class extends Guild {

    constructor(client, data) {

        super(client, data);

        this.player = {
            _queue      : [],
            _connection : null,
            _dispatcher : null,
            _isPlaying  : false,
            _volume     : 1,
            _embed      : {},
            _loop       : false,
            _ttl        : [0, 0],
        };

        this.local =
            (this.client.db.prepare("SELECT Local FROM Guilds WHERE _ID = ?").get(data.id)
            || this.client.db.prepare("INSERT INTO Guilds VALUES(?, ?)").run(data.id, "English") && { Local : "English" }).Local;

    }
});