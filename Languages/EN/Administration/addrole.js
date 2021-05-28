module.exports = {

    noTarget    : "You must choose a member",
    noRole      : "You must choose one or more roles",
    added       : ( added ) => added.length > 1 ? `The roles ${ added.join( ", " ) } have been added` : `The role ${ added.join( ", " ) } has been added`,
    nothing     : "Nothing has been added..."

};