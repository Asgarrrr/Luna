module.exports = {

    enabled         : "L'attribution automatique des rôles a été activée !",
    notEnabled      : "L'attribution automatique est cependant désactivée",
    currentRoles    : ( currentRoles ) => `Les roles ${ currentRoles.map( ( x ) => `<@&${x}>` ).join( ", ") } seront automatiquement attribués aux nouveaux arrivants.`,
    disabled        : "L'attribution automatique des rôles a été désactivée !",
    noRole          : "Aucun rôle à ajouter",
    noChanges       : ( operation ) => `Aucun changement, l'attribution automatique était déjà ${ operation ? "enabled" : "disabled" } `,
    error           : "Impossible de faire cela, une erreur s'est produite ...",
    missPerms       : "Les rôles suivants ne peuvent pas être ajoutés (permissions)",
    assigned        : "Les rôles définis sont les suivants",

};