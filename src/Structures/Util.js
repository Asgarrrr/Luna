// ██████ Integrations █████████████████████████████████████████████████████████

// —— Terminal string styling done right.
const chalk = require("chalk");

// ██████ | ███████████████████████████████████████████████████████████ | ██████

    /**
     * Search in all guilds or only one specific user by his ID or username.
     * @param {string}  query  // User ID or Username
     * @param {object}  [guild] // query only on specific guild
     */
    async function resolveUser(query, guild) {

        if (!query) return;

        return !isNaN(query) || query.match(/^<@(!|&)?(\d+)>$/)
            ? (
                query = query.replace(/\D/g, ""),
                guild
                    ? guild.members.cache.get(query)
                    : await this.users.fetch(query).catch(() => 0)
            )
            : (guild ? guild.members : this.users).cache.find((x) => x.username === query);

    }

    /**
    * Search in all guilds or only one specific channel by his ID or name.
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

    /**
    * Adds a user to the database
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

    /**
     * Converts a certain number of seconds to formatted time hh:mm:ss
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

module.exports = {
    resolveUser,
    resolveChannel,
    createUser,
    logger,
    formatTime,
};