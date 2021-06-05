module.exports = {

    notPlayer   : "He is not a valid player",
    noFriend    : "You don't have a friend? I could play against you soon! ",
    maxCells    : "Sorry, the board can't be bigger than 5 cells.",
    startTurn   : ( _currentPlayer ) => `It's <@${_currentPlayer}>'s turn to start `,
    winner      : ( winner ) => `<@${winner}> won the game`,
    drawn       : "Drawn match",
    turn        : ( _currentPlayer ) => `<@${_currentPlayer}>'s turn`,

};