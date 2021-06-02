module.exports = {

    invalidLimit    : "Please provide a numeric value for limit.",
    invalidRange    : "The limit must be between 1 and 100.",
    noMessage       : "It seems an error occurred in the messages fetching",
    invalidTarget   : "The target is not valid.",
    error           : ( size ) => `Unable to remove ${ size } messages.`,
    deleted         : ( size, target ) => `${ size } message ${ ( target && `from ${ target === "me" ? "you" : target }`) || ""} has been removed`,
    notDeleted      : "You cannot delete messages older than 14 days, also, you can delete messages from a user, role, or use keywords `me`, `bots`, `uploads` or `pins`"

};