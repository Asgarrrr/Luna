// ██████ Integrations █████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API
const { Structures, Guild } = require('discord.js');

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
        };


        let local =
            this.client.db.prepare('SELECT Local FROM Guilds WHERE _ID = ?').get(data.id)
            || this.client.db.prepare('INSERT INTO Guilds VALUES(?, 0)').run(data.id) && { Local : 0 };

        this.local = ["English", "French"][local.Local];

    }
});