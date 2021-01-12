// ██████ Integrations █████████████████████████████████████████████████████████

// —— Terminal string styling done right.
const chalk = require("chalk");

// ██████ | ███████████████████████████████████████████████████████████ | ██████

    async function resolveUser(search, guild){

        if (!search) return;

        return !isNaN(search) || search.match(/^<@(!|&)?(\d+)>$/)
            ? (
                search = search.replace(/\D/g,""),
                guild
                    ? guild.members.cache.get(search)
                    : await this.users.fetch(search).catch(() => {})
            )
            : (guild ? guild.members : this.users).cache.find((x) => x.username === search);

    }

    async function resolveChannel(search, guild){

        if (!search) return;

        return !isNaN(search) || search.match(/^<#(!|&)?(\d+)>$/)
            ? (
                search = search.replace(/\D/g,""),
                guild
                    ? guild.channels.cache.get(search)
                    : await this.channels.fetch(search).catch(() => {})
            )
            : (guild ? guild.channels : this.channels).cache.find((x) => x.name === search);

    }

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
            case "INFO": { console.log(`${time} │ ${message}`) };
                break;

            case "WARNING": {
                console.log(`${time} ⨯ ${chalk.hex("#ba8b00")(message)}`);
                this.db
                    .prepare("INSERT INTO Event ('Type', 'DATA') VALUES ('WARNING', ?)")
                    .run(message);
            } break;
        }
    }

    function formatTime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.round(seconds % 60);
        return [
          h,
          m > 9 ? m : (h ? '0' + m : m || '0'),
          s > 9 ? s : '0' + s
        ].filter(Boolean).join(':');
      }



module.exports = {
    formatTime
};