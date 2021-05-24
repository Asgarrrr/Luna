module.exports = {

    enabled         : "Automatic role assignment has been enabled!",
    notEnabled      : "Automatic role assignment is however disabled",
    currentRoles    : ( currentRoles ) => `Roles ${ currentRoles.map( ( x ) => `<@&${x}>` ).join( ", ") } will be automatically assigned to newcomers.`,
    disabled        : "Automatic role assignment has been disabled!",
    cantAdd         : ( roles ) => `Roles ${ roles.join( ", " ) } cannot be added. Their privileges are above mine, I can't give them`,
    noRole          : "You must specify one or more roles to add / remove",
    noChanges       : ( operation ) => `No change, automatic assignment was already ${ operation ? "enabled" : "disabled" } `,
    nothingToAdd    : "There are no roles to add",
    error           : "Impossible to do this, an error has occurred ...",
    missPerms       : "The following roles cannot be added",
    assigned        : "The defined roles are",

};