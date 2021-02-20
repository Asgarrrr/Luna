// ██████ Integrations █████████████████████████████████████████████████████████

// —— Terminal string styling done right.
const chalk = require("chalk")
// —— A powerful library for interacting with the Discord API
    , Discord = require("discord.js");

// ██████ | ███████████████████████████████████████████████████████████ | ██████


/** Extract the related object out of a Discord mention.**
  * @param      {string}        query   Mention.
  * @param      {Discord.Guild} [guild] Guild in which to search, if not mentioned, the mention ID is returned
  * @returns    {Object|null}           An object with a "member", "role" or "channel" property corresponding to the mention, or "null" if the provided channel is not a mention
  */
function resolveMention(query, guild) {

    // —— Throwing any necessary errors.
    if (typeof query !== "string")
        throw new TypeError("Invalid string provided.");

    if (guild && !(guild instanceof Discord.Guild))
        throw new TypeError("Invalid guild provided.");

    // —— Using a Regular Expression to test the mention and extract the parts.
    const match = query.match(/^<(@!?|@&|#)([0-9]+)>$/);

    if (match) {

        const prefix = match[1]
            , id     = match[2];

        // —— Returning objects with corresponding properties.
        return {

            [prefix.match(/^@!?$/)] : { member: guild ? guild.members.cache.get(id) || id : id },
            "@&" : { role: guild ? guild.roles.cache.get(id) || id : id },
            "#"  : { channel: guild ? guild.channels.cache.get(id) || id : id },

        }[prefix];

    // —— Returning null if the provided string was not a mention.
    } else return null;
}


/** Search in all guilds or only one specific user by his ID or username.
  * @param {string}  query   User mention
  * @param {object}  [guild] Query only on specific guild
  */
async function resolveUser(query, guild) {

        // —— Throwing any necessary errors.
        if (typeof query !== "string")
            throw new TypeError("Invalid string provided.");

        if (typeof guild && !(guild instanceof Discord.Guild))
            throw new TypeError("Invalid guild provided.");

        const match = query.match(/^<@!?(\d+)>$/);

        if (match && guild)
            return guild.members.cache.get(match[1]);
}
/** Search in all guilds or only one specific channel by his ID or name.
  * @param {string}  query  // User ID or Username
  * @param {object}  [guild] // Search only on specific guild
  */
async function resolveChannel(query, guild) {

    if (!query) return;

    return !isNaN(query) || query.match(/^<#(!|&)?(\d+)>$/)
        ? (
            query = query.replace(/\D/g, ""),
            guild
                ? guild.channels.cache.get(query)
                : await this.channels.fetch(query).catch(() => 0)
        )
        : (guild ? guild.channels : this.channels).cache.find((x) => x.name === query);

}

/** Adds a user to the database
  * @param {object}  user     // Guild user object
  * @param {object}  guild    // Guild object
  */
async function createUser(user, guild) {

    user = await this.resolveUser(user.id, guild);

    try {
        this.db
            .prepare("INSERT OR REPLACE INTO Members (_ID, UserID, GuildID, Guildname, Roles, JoinDate) VALUES (?, ?, ?, ?, ?, ?)")
            .run(`${guild.id}-${user.id}`, user.id, guild.id, guild.name, JSON.stringify(user._roles), user.joinedTimestamp);

    } catch (error) {
        console.error(error);
    }

    return user;

}

async function logger(type = "INFO", message) {

    if (this.config.logger !== true)
        return;

    const time = `${chalk.grey(new Date().toLocaleTimeString())}`;

    switch (type) {
        case "INFO": { console.log(`${time} │ ${message}`); }
            break;

        case "WARNING": {
            console.log(`${time} ⨯ ${chalk.hex("#ba8b00")(message)}`);
            this.db
                .prepare("INSERT INTO Event ('Type', 'DATA') VALUES ('WARNING', ?)")
                .run(message);
        } break;
    }
}

/** Converts a certain number of seconds to formatted time hh:mm:ss
  * @param {number} seconds // Name of second to convert
  */
function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.round(seconds % 60);
    return [
        h,
        m > 9 ? m : (h ? "0" + m : m || "0"),
        s > 9 ? s : "0" + s,
    ].filter(Boolean).join(":");
}

/** Checks that the user can use a music command
  * @param {Discord.Guild.player}   player  Guild Player
  * @param {Discord.Message}        message Message
  * @param {Object}                 lang    Language file
  */
function checkVoice(player, message, lang) {
    // —— Verifies if the user is connected to a voice channel
    if (!message.member.voice.channel)
        return message.channel.send(lang[0]);

    // —— Check if Luna is connected to a voice channel
    if (!player._connection)
        return message.channel.send(lang[1]);

    // —— Check if the user and Luna are on the same voice channel
    if (!player._connection.voice.channel.members.has(message.author.id))
        return message.channel.send(lang[2]);

    return 0;
}


function pageEmbed(message, pages, paging = false, trash = false) {

    let i = 0;

    paging && pages.map( (x, pi) => x.footer = { text: `${++pi} / ${Object.keys(pages).length}` } );

    message.channel.send({embed: pages[i]}).then( async (msg) => {

        await msg.react("⬅️");

        // —— Create a reaction collector
        const backFilter = (reaction) => reaction.emoji.name === "⬅️";
        const backCollector = msg.createReactionCollector(backFilter, { time: 900000 });

        await msg.react("➡️");

        // —— Create a reaction collector
        const nextFilter = (reaction) => reaction.emoji.name === "➡️";
        const nextCollector = msg.createReactionCollector(nextFilter, { time: 900000 });

        backCollector.on("collect", (r) => {

            i > 0 && msg.edit({embed: pages[--i]});
            r.users.remove(r.users.cache.filter(u => u === message.author).first());

        });

        backCollector.on("end", () => msg.reactions.removeAll().catch(() => {}));

        nextCollector.on("collect", (r) => {

            i < Object.keys(pages).length + 1 && msg.edit({embed: pages[++i]});
            r.users.remove(r.users.cache.filter((u) => u === message.author).first());

        });

        if (trash) {

            await msg.react("🗑️");

            // —— Create a reaction collector
            const trashFilter = (reaction) => reaction.emoji.name === "🗑️"
                , trashCollector = msg.createReactionCollector(trashFilter, { time: 900000 });

            trashCollector.on("collect", (r) => msg.delete({ timeout: 0 }));
        }

    });



}

module.exports = {
    resolveMention,
    resolveUser,
    resolveChannel,
    createUser,
    logger,
    formatTime,
    checkVoice,
    pageEmbed,
};