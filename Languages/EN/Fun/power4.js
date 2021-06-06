module.exports = {

    notPlayer   : "He is not a valid player",
    noFriend    : "You don't have a friend? I could play against you soon! ",
    noMe        : () => ["I'm learning to become invincible at this game, just wait a little longer :3", "I don't have a mouse, I can't click on the boxes", "I don't want to play <:angry:850736814498250773>"][~~( Math.random() * 3 )],
    startTurn   : ( _currentPlayer ) => `It's <@${_currentPlayer}>'s turn to start `,
    winner      : ( winner ) => `<@${winner}> won the game`,
    drawn       : "Drawn match",
    turn        : ( _currentPlayer ) => `<@${_currentPlayer}>'s turn`,
    newGame     : "Start new game ?",
    end         : "The game time is over"

};