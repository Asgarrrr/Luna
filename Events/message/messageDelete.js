// ██████ Integrations █████████████████████████████████████████████████████████

// —— Base structure
const Event = require('../../Structures/Event');

// ██████ | █████████████████████████████████████████████████████████████████████

class messageDelete extends Event {

    constructor( client ) {
        super( client )
    }

    async run( message ) {

        await this.client.db.Message.findOneAndUpdate({
            _ID     : message.id,
            _guildID: message.guild.id,
        }, {
            deleted : true
        }, {
            upsert  : true,
            new     : true,
        }).exec();

    }


}

module.exports = messageDelete;