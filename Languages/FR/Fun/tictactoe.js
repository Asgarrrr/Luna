module.exports = {

    notPlayer   : "Ce n'est pas un joueur valide.",
    noFriend    : "Tu n'as pas d'ami ? Je pourrais jouer contre vous bientôt !",
    maxCells    : "Désolé, le tableau ne peut pas être plus grand que 5 cellules.",
    startTurn   : ( _currentPlayer ) => `C'est au tour de <@${_currentPlayer}> de commencer.`,
    winner      : ( winner ) => `<@${winner}> a gagné la partie`,
    drawn       : "Match nul",
    turn        : ( _currentPlayer ) => `C'est au tour de <@${_currentPlayer}>.`,

};