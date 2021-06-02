module.exports = {

    invalidLimit    : "Veuillez fournir une valeur numérique pour la limite.",
    invalidRange    : "La limite doit être comprise entre 1 et 100",
    noMessage       : "Il semble qu'une erreur se soit produite lors de la récupération des messages.",
    invalidTarget   : "La cible n'est pas valide.",
    error           : ( size ) => `Incapable de supprimer ${ size } messages.`,
    deleted         : ( size, target ) => `${ size } messages ${ ( target && `de ${ target === "me" ? "you" : target }`) || "" } ont été supprimé`,
    notDeleted      : "Vous ne pouvez pas supprimer les messages de plus de 14 jours, vous pouvez également supprimer les messages d'un utilisateur, d'un rôle ou utiliser les mots-clés `me`, `bots`, `uploads` ou `pins`."

};