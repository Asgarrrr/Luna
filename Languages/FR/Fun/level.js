module.exports = {

    notFound    : "Aucun utilisateur trouvé",
    noOperator  : "Vous devez fournir un opérateur. `+`, `-`, `*`, `/` ou `=`",
    noQuantity  : "Vous devez entrer un montant valide",
    noChange    : "Aucune modification n'a été effectuée",
    updated     : "Mise à jours des niveaux",
    updatedData : ( updated, target ) => `Les niveaux de ${ updated > 1 ? `${ updated } membres` : `<@${ target[0]._ID }>` } ont été mis à jours`,
    error       : "Une erreurs est survenue",

};