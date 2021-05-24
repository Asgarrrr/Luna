const { model, Schema } = require("mongoose");

module.exports = model("Message", new Schema({

    _ID         : String,
    _userID     : String,
    _guildID    : String,
    _channelID  : String,

    content     : String,
    attachments : String,

    timestamp   : { type : Date,    default : Date.now() },
    modified    : { type : Array,   default : [] },
    deleted     : { type : Boolean, default : false },

}));