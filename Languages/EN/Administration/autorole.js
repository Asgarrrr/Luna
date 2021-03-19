module.exports = {

    enabled         : "Automatic role assignment has been activated !",
    notEnabled      : "The automatic assignment is however disabled",
    currentRoles    : ( currentRoles ) => `Roles ${ currentRoles.map( ( x ) => `<@&${x}>` ).join( ", ") } will be automatically given to new arrivals.`,
    disabled        : "Automatic role assignment has been disabled !",
    noChanges       : ( operation ) => `No change made, automatic assignment was already ${ operation ? "enabled" : "disabled" } `,
    noRole          : "No role to add",
    error           : "Impossible to do this, an error occurred ...",
    missPerms       : "The following roles cannot be added (permissions)",
    assigned        : "The defined roles are as follows",

};