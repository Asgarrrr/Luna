module.exports = {

// —— Basic configuration information, essential.

    // — The bot's token, found on the Discord developers portal
    Token: "",

    // — Your User ID
	Master: "",

    // — The prefix for calling commands
	Prefix: "£",

    // — The secret client for interaction with the Discord API, also found on Discord developers portal
    Secret: "",

    // —— Default language, for you and the dashboard, you can configure the language used in each guild independently via the command `language`.
    Language: "English",

// —— Activity configuration

    Presence: {
		status: "Online",
        // —— You can add unlimited number of games, or keep one only
		games: [{
            // — 'type' can be PLAYING STREAMING LISTENING WATCHING COMPETING, you need to provide Twitch URL for STREAMING
		    type: "WATCHING",
		    name: "You",
		    url: ""
		}, {
            type: "PLAYING",
		    name: "Epic Seven",
		    url: ""
        }],

        // — Status will change every 15 seconds
		interval: 15
	},

// —— Dashboard configuration

    dashboard: {
		expressSPass: "secret",
		url: "http://localhost:3000"
	},

// —— Save events, messages, etc in database
    logger : true,

// —— Modules
    module : {
        xp : true
    }

}