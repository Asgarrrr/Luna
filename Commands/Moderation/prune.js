// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command = require("../../Structures/Command");

// ██████ | ███████████████████████████████████████████████████████████████████

// —— Create & export a class for the command that extends the base command
class Prune extends Command {

    constructor( client ) {
        super( client, {
            name        : "prune",
            description : "Delete a quantity of messages in a channel sent by a member, all members with a role, bots, pinned messages, files or only yours",
            usage       : "prune {number} {user | role | Keyword ( me | bots | uploads | pins )}",
            example     : ["100 @Asgarrrr", "50 @Admin", "10", "100 bots"],
            args        : true,
            category    : "Moderation",
            cooldown    : 1000,
            aliases     : [ "purge" ],
            userPerms   : "MANAGE_MESSAGES",
            guildOnly   : true,
        });
    }

    async run(message, [ limit, target ]) {

        // —— Numeric value for limit
        if ( isNaN( limit ) )
            return super.respond( this.language.invalidLimit );

        // —— The limit must be between 1 and 100.
        if ( limit < 1 || limit > 100 )
            return super.respond( this.language.invalidRange );

        // —— Create a collection with the last 100 messages
        let fetchedMessages = await message.channel.messages.fetch({ limit }).catch( ( ( err ) => null ) );

        // —— If no message could be found.
        if ( !fetchedMessages )
            return super.respond( this.language.noMessage );

        if ( target ) {

            let resolvedTarget;
            const { resolveMention } = this.client.utils;


            if ( target.match(/^<(@!?|@&)([0-9]+)>$/) ) {

                resolvedTarget = await resolveMention( target, message.guild );

                if ( !resolvedTarget )
                    return super.respond( this.language.invalidTarget );

                target = resolvedTarget.constructor.name;

            }

            fetchedMessages = fetchedMessages.filter( ( m ) => {

                switch ( target.toLowerCase() ) {

                    case "role":
                        return m.member.roles.cache.has( resolvedTarget.id );
                    case "guildmember":
                        return m.member.id === resolvedTarget.id;
                    case "me":
                        return m.author.id === message.author.id;
                    case "bots":
                        return m.author.bot;
                    case "uploads":
                        return m.content.match(/(https?:\/\/[^\s]+)/gm);
                    case "pins":
                        return m.type === "PINS_ADD";
                    default:
                        break;
                }

            });

        }

        // —— Deletes messages corresponding to the filtered collection
        const removed = await message.channel.bulkDelete( fetchedMessages, true )
            .catch( () => super.respond( this.language.error( removed.size ) ) );

        super.respond( removed.size
            ? this.language.deleted( removed.size, target )
            : this.language.notDeleted );

    }
}

module.exports = Prune;
