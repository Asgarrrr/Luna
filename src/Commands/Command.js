

module.exports = class Command {

    constructor(client, options) {

        this.client = client;

        this.help = {
            name        : options.name        || null,
            description : options.description || "No information specified.",
            args        : options.args        || false,
            usage       : options.usage       || null,
            exemple     : options.exemple     || null,
            category    : options.category    || "General"
        };

        this.conf = {
            permLevel   : options.permLevel   || 0,
            permission  : options.permission  || "SEND_MESSAGES",
            cooldown    : options.cooldown    || 1000,
            aliases     : options.aliases     || [],
            allowDMs    : options.allowDMs    || false
        };

        this.cooldown = new Map();
    }

    startCooldown(user) {

        this.cooldown.set(user, Date.now() + this.conf.cooldown);

        setTimeout(() => {
            this.cooldown.delete(user);
        }, this.conf.cooldown);
    }

    setMessage(message) {
        this.message = message;
    }

    respond(message) {
        this.message.channel.send(message);
    }
}
