module.exports = {

    details     : ( banned ) => `<@${banned.target.id}> a été banni pour le / les motif(s) suivants : \n\n> ${banned.reason ? banned.reason : "Aucun motif fourni" } \n\nLa sentence à été prononcé par <@${banned.executor.id}>`,
    missDetails : ( user   ) => `<@${user.id}> a été banni, mais j'ignore par qui et pourquoi ...`,
    error       : "Un bannissement a eu lieu, mais il semblerait qu'une erreur se soit produite"

};