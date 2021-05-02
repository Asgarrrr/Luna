const { model, Schema } = require("mongoose");

module.exports = model("Guild", new Schema({

    // —— Basic information
    _ID         : String,

    prefix      : { type : String, default: "£" },
    language    : { type : String, default: "EN" },

    plugins     : { type: Object, default: {

        experience : { enabled: true, },

        logger : {
            enabled : true,
            channel : null
        },

        autorole : {
            enabled : false,
            roles   : []
        }
    }},

    // —— Channels ignored
    ignored     : { type: Array, default: [] },

    // —— Commands disabled
    disabled    : { type: Array, default: [] },


}));