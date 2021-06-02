module.exports = {

    noTarget    : "Vous devez choisir un membre",
    noRole      : "Vous devez choisir un ou plusieurs rôles",
    added       : ( added ) => added.length > 1 ? `Les rôles ${ added.join( ", " ) } ont été ajoutés` : `Le rôle ${ added.join( ", " ) } a été ajouté`,
    nothing     : "Rien n'a été ajouté..."

};