module.exports = {

    notInVoice  : "You need to be a in voice channel.",
    busy        : "Luna is already busy with other listeners, join her!",
    cantJoin    : "Unable to join voice channel.",
    notFound    : "This element was not found.",
    cantPlay    : "This track cannot be played",
    embedDesc   : ( message, length ) => `<@${ message.author.id }> added an items to the playlist ( \`${ length === "0:00" ? "Live" : length }\` )`,
    embedDescPl : ( message, size = 0, length = 0, lives = 0 ) => `<@${ message.author.id }> added ${ size } items to the playlist ( \`${ length }\` ${ lives > 0 ? `& \`${ lives } lives\`` : "" } )`,
    incorrect   : "The url you entered seems to be incorrect.",
    mix         : "Mixes not supported.",
    cantGetPlst : "Unable to get this playlist.",
    emptyPlst   : "The playlist seems empty.",
    error       : "An error has occurred",
    now         : "Now playing..."

};