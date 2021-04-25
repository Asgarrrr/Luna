const { model, Schema } = require("mongoose");

module.exports = model( "Member", new Schema({

    // —— Basic information
    _ID         : String,
    _guildID    : String,
    joinDate    : { type : Date, default : Date.now() },

    // —— Levelling system
    experience  : { type: Number, default: 0 },
    level       : { type: Number, default: 1 },
    bio         : String,

    // —— Moderation register
	mute        : {
        type    : Object,
        default : { muted : false, end : null }
    },
    sanction    : { type: Array, default: [] }

}));