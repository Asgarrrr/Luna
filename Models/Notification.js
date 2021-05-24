const { model, Schema } = require( "mongoose" );

module.exports = model( "Notification", new Schema( {

    YBChannelID : String,
    pubDate     : { type: Date, default: Date.now },
    guild       : {
        type    : Array,
        default : []
    }

} ));