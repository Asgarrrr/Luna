// —— Import base command
const Command = require("../../Structures/Command");

const { resolveMention } = require("./../../Structures/Util");

class Prune extends Command {

    constructor(client) {
        super(client, {
            name        : "prune",
            description : "Delete messages from the server",
            usage       : "prune number [@user | Keyword]",
            args        : true,
            category    : "Moderation",
            cooldown    : 1000,
            aliases     : ["purge"],
            permLevel   : 9,
            userPerms   : "MANAGE_MESSAGES",
            allowDMs    : false,
        });
    }

    async run(message, [ limit, target ]) {

        if(isNaN(limit))
            return super.respond("Please provide a numeric value for limit");

        if(limit < 1 || limit > 100)
            return super.respond("The limit must be between 1 and 100.");

        // —— Create a collection with the last 100 messages
        let fetchedMessages = await message.channel.messages.fetch({ limit }).catch(console.error);

        if (target) {

            // —— If target is a role or a user
            if (target.match(/^<(@!?|@&)([0-9]+)>$/)) {

                // —— Resolve user / role informations
                const fetchedUser       = resolveMention(target, message.guild)
                    , [ type, content ] = Object.entries(fetchedUser)[0];

                if (typeof content !== "object")
                    return super.respond(`${target} seems not to be a valid ${type}`);

                fetchedMessages = fetchedMessages.filter((x) => {
                    return {
                        "role"   : x.member._roles.includes(content.id),
                        "member" : x.member.id === content.id,
                    }[type];
                });

            } else {

                fetchedMessages = fetchedMessages.filter((x) => {
                    return {
                        "me"        : x.author.id === message.author.id,
                        "bots"      : x.author.bot === true,
                        "uploads"   : x.content.match(/(https?:\/\/[^\s]+)/gm),
                        "pins"      : x.type === "PINS_ADD",
                    }[target];
                });
            }
        }

        // —— Deletes messages corresponding to the filtered collection
        const removed = await message.channel.bulkDelete(fetchedMessages, true)
            .catch(() => {
                return super.respond(`Unable to remove ${fetchedMessages.size}`);
            });

        if (removed.size > 1) {

            super.respond(`${removed.size} message ${ (target && `from ${ target === "me" ? "you" : target } `) || "" }has been removed`);

            this.client.db.prepare("INSERT INTO Event('Type', 'DATA') VALUES(?, ?)").run(
                "PRUNE",
                JSON.stringify({ by: message.author.id, deleted: removed.map((x) => x.id) }),
            );
        } else if(removed.size === 1)
            super.respond("You cannot delete messages older than 14 days, also, you can delete messages from a user, role, or use keywords `me`, `bots`, `uploads` or `pins`");

    }
}

module.exports = Prune;