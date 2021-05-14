module.exports = {

    notInVoice  : "Vous devez être un channel vocal",
    busy        : "Luna est déjà occupée avec d'autres auditeurs, rejoignez-la !",
    cantJoin    : "Impossible de rejoindre le channel vocal...",
    notFound    : "Cet élément n'a pas été trouvé.",
    cantPlay    : "Cet élément ne peut être lu",
    embedDesc   : ( message, length ) => `<@${ message.author.id }> a ajouté un élément à la liste de lecture ( \`${ length === "0:00" ? "Live" : length }\` )`,
    embedDescPl : ( message, size = 0, length = 0, lives = 0 ) => `<@${ message.author.id }> a ajouté ${ size } éléments à la liste de lecture ( \`${ length }\` ${ lives > 0 ? `& \`${ lives } lives\`` : "" } )`,
    incorrect   : "L'url que vous avez saisie semble être incorrecte.",
    mix         : "Les mix ne sont pas pris en charge.",
    cantGetPlst : "Impossible d'obtenir cette playlist.",
    emptyPlst   : "La playlist semble vide.",
    error       : "Une erreur s'est produite",
    now         : "En cours de lecture...",
};