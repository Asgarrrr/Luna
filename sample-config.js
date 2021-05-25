module.exports = {
// —— Basic configuration information, essential.
    // — The bot's token found in the Discord developer portal — in the 'bot' section, under the name.
    Token: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    /* — Your User ID ( Go to the settings of your discord, in the 'Advanced'
         section, then enable 'Developer mode' ) Right click on your profile and 'Copy ID'. */
    Master: "000000000000000000",
    // — The secret client for interaction with the Discord API, also found on Discord developers portal, in the 'OAuth2' section, in 'Client information'.
    Secret: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    // — URL of your MongoDB database ( see the appropriate section for more details )
    mongodb: "mongodb://xxxxxxxxxxxxxxxxx...",
// —— Activity configuration
    Presence: {
        status: "Online",
        // —— You can add unlimited number of games, or none in fact, just leave it like this: games: []
        games: [{
            // — 'type' can be PLAYING STREAMING LISTENING WATCHING COMPETING, you need to provide Twitch URL for STREAMING
            type: "WATCHING",
            name: "You",
            url: ""
        }, {
            type: "PLAYING",
            name: "A cool game",
            url: ""
        }],
        // — Status will change every 15 seconds
        interval: 15
    },
}