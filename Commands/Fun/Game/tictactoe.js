// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command              = require( "../../../Structures/Command" )
// —— A fast and easy API to create a buttons in discord using discord.js
    , { MessageButton,
        MessageActionRow } = require('discord-buttons');

// ██████ | ███████████████████████████████████████████████████████████████████

// —— Create & export a class for the command that extends the base command
class TicTacToe extends Command {

	constructor(client) {
		super(client, {
			name        : "tictactoe",
			description : "Starts a game of tic tac toe with another member",
            aliases     : ["morpion"],
			usage       : "tictactoe { opponent } [ grid size ( between 3 and 5 ) ]",
			exemple     : [ "tictactoe @asgarrrr 4" ],
			args        : true,
			category    : "Fun",
			cooldown    : 5,
			userPerms   : "SEND_MESSAGES",
			guildOnly   : true,
		});

	}

    async run( message, [ opponent, size = 3 ] ) {

        const { resolveMention } = this.client.utils;

        opponent = await resolveMention( opponent, message.guild, 1 );

        if ( !opponent )
            return super.respond( this.language.notPlayer );

        if ( opponent.id === message.author.id )
            return super.respond( this.language.noFriend );

        if ( opponent.id === this.client.user.id )
            return super.respond( this.language.noMe() );


        size = parseInt( size, 10 );

        console.log(size);

        if ( size > 5 )
            return super.respond( this.language.maxCell );

        // —— Generates a board of the desired size
        const board          = Array.from( Array( size ), () => new Array( size ).fill( 0 ) );
        // —— Create the components according to the board
        const buttonBoard    = board.map( ( x, xi ) => {
            return new MessageActionRow().addComponents( x.map( ( y, yi ) => {
                return new MessageButton().setLabel( " " ).setStyle( "grey" ).setID(`${xi}${yi}`)
            }))
        });

        const _players = {
            first   : message.author.id,
            second  : opponent.id
        }

        let move = 0;
        let _currentPlayer = Math.random() < 0.5 ? _players.first : _players.second;

        const game = await message.channel.send( this.language.startTurn( _currentPlayer ), { components : buttonBoard });

        const collector = game.createButtonCollector(
            ( button ) => button.clicker.user.id === _currentPlayer,
            { time: 480000 }
        ).on( "collect", async ( b ) => {

            // —— Determines the coordinates of the clicked cell.
            const c = b.id.split( "" ).map( ( c ) => parseInt( c, 10 ) );

            // —— Apply the movement to the game grid
            board[ c[0] ][ c[1] ] = _players.first === _currentPlayer ? -1 : 1;
            buttonBoard[ c[0] ].components[ c[1] ]
                .setDisabled( )
                .setLabel( board[ c[0] ][ c[1] ] === -1 ? "✗" : "〇" );

            _currentPlayer = _currentPlayer === _players.first
                ? _players.second
                : _players.first;

            move++;

            const winner = this.getWinner( board, buttonBoard );

            if ( winner ) {

                const winnerPlater = winner === -size ? _players.first : _players.second;

                await game.edit( this.language.winner( winnerPlater ), { components : buttonBoard });

                collector.stop( "winner" )

            } else {

                if ( move === Math.pow( board.length, 2 ) ) {

                    await game.edit( this.language.drawn, { components : buttonBoard });
                    collector.stop( "drawn" );

                } else await game.edit( this.language.turn( _currentPlayer ), { components : buttonBoard });

            }

            await b.defer();

        }).on( "end", ( b ) => {

            buttonBoard.map( ( x ) => x.components.map( ( y ) => y.setDisabled() ) );
            game.edit( { components : buttonBoard } );

        });

    }

    getWinner( board, buttonBoard ) {

        const sum = ( array ) => array.reduce( ( a, b ) => a + b );

        for ( let r = 0; r < board.length; r++ ) {

            // —— Line
            const line = sum( board[r] );

            if ( board.length === line || board.length === -line ) {
                buttonBoard[ r ].components.forEach( ( c ) => c.setStyle( "green" ) );
                return line;
            }

            // —— Col
            const col = sum( board.map( ( e ) => e[r] ) );

            if ( board.length === col || board.length === -col  ) {
                buttonBoard.map( ( line ) => line.components[ r ].setStyle("green") );
                return col;
            }

        }

        // —— Diagonal
        const diagonal = sum( board.map( ( row, r ) => board[r][r] ) );

        if ( board.length === diagonal || board.length === -diagonal  ) {

            board.map( ( row, r ) => buttonBoard[r].components[r].setStyle( "green" ) );
            return diagonal;
        }

        const crossdiagonal = sum( board.map( ( row, r ) => board[r][board.length-r-1] ) );

        if ( board.length === crossdiagonal || board.length === -crossdiagonal ) {

            board.map( ( row, r ) => buttonBoard[r].components[board.length-r-1].setStyle( "green" ) );
            return crossdiagonal;
        }

    }

}

module.exports = TicTacToe;