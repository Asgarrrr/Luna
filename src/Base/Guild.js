// ██████ Integrations █████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API
const { Structures } = require('discord.js');

// ██████ | ███████████████████████████████████████████████████████████ | ██████

Structures.extend("Guild", Guild => class extends Guild {

    constructor(client, data) {

        super(client, data);

        this.player = {
            queue      : [],
            connection : null,
            dispatcher : null,
            isPlaying  : false,
            volume     : 1,
        };
    }
})
