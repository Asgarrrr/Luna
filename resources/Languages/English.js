

// This class is used to store languages strings

module.exports = class {
    constructor() {
        this.language = {

// –––––––– SETUP –– "setup.js" ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

            SETUP: {
                MSG1         : "\nAll these settings can be found in the 'settings.json' file, you can change them manually.",
                LangSelec    : "Hello! To simplify things, let's start by choosing a language",
                Token        : "Perfect! Now please enter the bot's token from the application page",
                WrongToken   : "It seems this token is invalid...",
                OwnerID      : "And the bot owner's User ID ?",
                WrongOwner   : "This ID doesn't seem exists...",
                Prefix        : "The prefix ?",
                RichPType    : "What kind of activity does the bot do ?",
                RichPTypeDF  : ["Playing", "Streaming", "Listening", "Watching", "Nothing", "– (Disables bot activity)"],
                RichPresence : "And what does he do exactly ?",
                StreamURL    : "What is the url of the stream ?",
                Completed    : "––––– 🔥  All is ready ! ––––––––––––––––––––––––––––––––",
                CNext        : "Ok username,\n\nLuna is now configured; you can, if you haven't\nalready invited Luna on your server! : ",
                End          : "Now all you have to do is type command and she'll wake up."
            },

                ready: (client, DHPort, os, percent, version) => [
                    `Connected in ${client.uptime}ms as ${client.user.tag} !`,
                    `✨ On ${client.guilds.cache.size} servers, covering ${client.channels.cache.size} channels and ${client.users.cache.size} users.`,
                    `🔥 Dashboard started on port ${DHPort}`,
                    "",
                    "               × ",
                    `   Memory used │ ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB`,
                    `           CPU │ ${os.cpus().map((i) => `${i.model}`)[0]}`,
                    `     CPU usage │ ${percent.toFixed(2)}%`,
                    `      Platform │ ${os.platform()}`,
                    `  Architecture │ ${os.arch()}`,
                    "               ×",
                    `    Discord.js │ v${version}`,
                    `          Node │ ${process.version}`,
                    "               ×",
                    "               │"
                ],

                readylog: (client, os) => `${client.user.tag} was connected in ${client.uptime}ms from "${os.hostname()}"(${os.networkInterfaces().en0[1].address})`,


            commands: {

                avatar: (target) => [
                    `This is your avatar, ${target.tag}`,
                    `Here is the profile picture of ${target.tag}`
                ],

                ping: (Lat, client, message) => [
                    `   Latency │ ${Lat}ms`,
                    ` Websocket │ ${Math.round(client.ws.ping)}ms`,
                    "— Servers Status",
                    `Command executed by @${message.author.tag}`
                ],
            },
        };
    }

    get(term, ...args) {
        //if (!this.enabled && this !== this.store.default) return this.store.default.get(term, ...args);
        const value = this.language[term];
        switch (typeof value) {
            case "function": return value(...args);
            default: return value;
        }
    }
};