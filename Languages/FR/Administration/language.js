module.exports = {

    choose      : "Les langues disponibles sont le suivantes :",
    available   : ( available, client ) => {

        return ( available.map( ( x ) => {

            const { ISO, name } = client.language[x].informations;

            return `\` ${ISO} \` : ${name} `

        } ) ).join( "\n" );

    },

    howUse      : "Entrez le code de la langue que vous souhaitez utiliser",
    timeEnd     : "Le temps est écoulé ...",
    done        : "La langue a bien été modifiée",
    new         : "Je vais maintenant parler en français"

};