module.exports = {

    notFound    : "No user found",
    noOperator  : "You must provide an operator. `+`, `-`, `*`, `/` or `=`",
    noQuantity  : "You must enter a valid amount",
    noChange    : "No change has been made",
    updated     : "Levels have been updated",
    updatedData : ( updated, target ) => `The levels of ${ updated > 1 ? `${ updated } members` : `<@${ target[0]._ID }>` } have been updated`,
    error       : "An error has occurred",



};