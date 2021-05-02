module.exports = {

    ping        : "envoie de la balle ...",
    latency     : "Latence",
    components  : "Services",
    servers     : "État des serveurs",
    events      : "Évènements",
    state       : ( code ) => ({
        "none"      : "Tous les systèmes sont opérationnels.",
        "minor"     : "Panne partielle du service.",
        "major"     : "Panne majeure du service.",
        "critical"  : "C'est la merde"
    })[ code ]

};