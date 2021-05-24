module.exports = {

    enabled         : "L'attribution automatique des rôles a été activée !",
    notEnabled      : "L'attribution automatique est cependant désactivée",
    currentRoles    : ( currentRoles ) => `Les roles ${ currentRoles.map( ( x ) => `<@&${x}>` ).join( ", ") } seront automatiquement attribués aux nouveaux arrivants.`,
    disabled        : "L'attribution automatique des rôles a été désactivée !",
    cantAdd         : ( roles ) => `Les roles ${ roles.join( ", " ) } ne peuvent pas être ajoutés. Leurs privilèges sont au dessus des miens, je ne peux pas les donner`,
    noRole          : "Vous devez spécifier un ou plusieurs rôles à ajouter / supprimer",
    noChanges       : ( operation ) => `Aucun changement, l'attribution automatique était déjà ${ operation ? "enabled" : "disabled" } `,
    nothingToAdd    : "Il n'y a aucun rôle à ajouter",
    error           : "Impossible de faire cela, une erreur s'est produite ...",
    missPerms       : "Les rôles suivants ne peuvent pas être ajoutés",
    assigned        : "Les rôles définis sont",

};