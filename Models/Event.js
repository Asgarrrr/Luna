const { model, Schema } = require("mongoose");

module.exports = model("Event", new Schema({

    type        : String,
    content     : String,

    _userID     : String,
    _guildID    : String,

    timestamp   : { type : Date,  default : Date.now() },


}));