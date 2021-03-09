// ██████ Integrations █████████████████████████████████████████████████████████

// —— Base structure
const Event = require('../../Structures/Event');

// ██████ | █████████████████████████████████████████████████████████████████████

class messageUpdate extends Event {

    constructor( client ) {
        super( client )
    }

    async run( oldMessage, newMessage ) {

        await this.client.db.Message.findOneAndUpdate({
            _ID     : oldMessage.id,
            _guildID: oldMessage.guild.id,
        },
        {
            $push: {
                modified : {
                    content     : newMessage.content,
                    timestamp   : newMessage.editedTimestamp,
                }
            },
        }, {
            upsert  : true,
            new     : true,
        }).exec();

    }


}

module.exports = messageUpdate;