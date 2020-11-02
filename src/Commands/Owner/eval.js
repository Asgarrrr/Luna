// —— Import base command
const Command = require("../../Base/Command");

class Eval extends Command {

    constructor(client) {
        super(client, {
            name        : "eval",
            description : "Evaluate/Execute JavaScript code",
            usage       : "eval [code]",
            args        : true,
            category    : "Owner",
            cooldown    : 0,
            permLevel   : 10,
            allowDMs    : true,
            ownerOnly   : true
        });
    }

    async run(message, [...code]) {

        try {

            let evaled = await eval(code.join(" "));

            if( typeof evaled !== "string" )
                evaled = require("util").inspect(evaled, { depth: 0 });

            if( evaled.includes(this.client.token) )
                evaled = evaled.replace(new RegExp(this.client.token, "g"), '*Token*');

            message.channel.send(evaled, { code: "js" });

        } catch (error) {

            error = error.toString();

            if( error.includes(this.client.token) )
                error = error.replace(new RegExp(this.client.token, "g"), '*Token*');

            message.channel.send(error, { code: "js" });

        }

    }
}

module.exports = Eval;