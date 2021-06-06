module.exports = {

    notPlayer   : "Ce n'est pas un joueur valide.",
    noFriend    : "Tu n'as pas d'ami ? Je pourrais jouer contre vous bientôt !",
    noMe        : () => ["J'apprends à devenir invincible à ce jeu, il suffit d'attendre un peu plus longtemps :3", "Je n'ai pas de souris, je ne peux pas cliquer sur les cases ", "Je ne veux pas jouer <:angry:850736814498250773>"][~~( Math.random() * 3 )],
    startTurn   : ( _currentPlayer ) => `C'est au tour de <@${_currentPlayer}> de commencer.`,
    winner      : ( winner ) => `<@${winner}> a gagné la partie`,
    drawn       : "Match nul",
    turn        : ( _currentPlayer ) => `C'est au tour de <@${_currentPlayer}>.`,
    newGame     : "Nouvelle partie ?",
    end         : "Le temps de jeu est écoulé"

};