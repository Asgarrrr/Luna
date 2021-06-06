// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command           = require( "../../../Structures/Command" )
// —— A fast and easy API to create a buttons in discord using discord.js
    , { MessageButton } = require('discord-buttons');

// ██████ | ███████████████████████████████████████████████████████████████████

// —— Create & export a class for the command that extends the base command
class Power4 extends Command {

   constructor(client) {
       super(client, {
           name        : "power4",
           description : "Start a Power 4 game",
           usage       : "power4 ",
           example     : [ "power4 @Asgarrrr" ],
           args        : true,
           category    : "Fun",
           cooldown    : 5000,
           guildOnly   : true,
       });
   }
   async run( message, [ opponent ] ) {

        const { resolveMention } = this.client.utils;

        opponent = await resolveMention( opponent, message.guild, 1 );

        if ( !opponent )
            return super.respond( this.language.notPlayer );

        if ( opponent.id === message.author.id )
            return super.respond( this.language.noFriend );

        if ( opponent.id === this.client.user.id )
            return super.respond( this.language.noMe() );

        // —— Generates a board of the desired size
        const board  = Array.from( Array( 6 ), () => new Array( 7 ).fill( 0 ) );
        const select = [ "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣" ];

        const _players = {
            first   : message.author.id,
            second  : opponent.id
        }

        let move = 0;
        let _currentPlayer = Math.random() < 0.5 ? _players.first : _players.second;

        const game = await message.channel.send(
            this.language.startTurn( _currentPlayer ),
            { embed: {
                color       : _players.first === _currentPlayer ? "#DD2E44" : "#FDCB58",
                description : this.renderBoard( board ),
            }
        });

        let gameEnd = false;

        await Promise.all( select.map( ( r ) => game.react( r ) ) );

        const interactions = game.createReactionCollector(
            ( r, u ) => select.includes( r.emoji.name ) && u.id === _currentPlayer && !gameEnd,
            { time: 480000 }
        ).on( "collect", async ( r, u ) => {

            if ( gameEnd )
                return;

            // —— Determine the column where to place the piece.
            const col = select.indexOf( r.emoji.name )
            // —— Determine the line where to place the piece.
                , state = board.map( ( x ) => x[ col ] ).lastIndexOf( 0 );

            // —— Suppresses the user's reaction
            r.users.remove( u.id );

            if ( state > 5 )
                return;

            // —— Determine which "type" of piece to place
            const turn = _players.first === _currentPlayer ? -1 : 1;

            // —— Place in the grid the piece
            board[ state ][ col ] = turn;

            if ( this.getWinner( board, state, col, turn ) ) {

                await game.edit(
                    this.language.winner( _currentPlayer ),
                    { embed: {
                        color       : _players.first === _currentPlayer ? "#DD2E44" : "#FDCB58",
                        description : this.renderBoard( board )
                    }
                });

                gameEnd = true;

            } else {

                if ( ++move == 42 ) {

                    await game.edit(
                        this.language.drawn,
                        { embed: {
                            description : this.renderBoard( board )
                        }
                    });

                    gameEnd = true;

                } else {

                    _currentPlayer = _currentPlayer === _players.first
                        ? _players.second
                        : _players.first;

                    await game.edit(
                        this.language.turn( _currentPlayer ),
                        { embed: {
                            color       : _players.first === _currentPlayer ? "#DD2E44" : "#FDCB58",
                            description : this.renderBoard( board )
                        }
                    });

                }

            }

            if ( gameEnd ) {

                let button = new MessageButton()
                    .setLabel( `${ this.language.newGame } 0/2` )
                    .setStyle( "grey" )
                    .setID( "restart" );

                game.edit({ component: button });

                const restart = game.createButtonCollector(
                    ( b ) => b.clicker.user.id === _players.first || b.clicker.user.id === _players.second,
                    { time: 120000, dispose: true, errors: ["time"] }
                );

                let wantRetry = new Map();

                restart.on( "collect", async ( b ) => {

                    wantRetry.has( b.clicker.user.id )
                        ? wantRetry.delete( b.clicker.user.id )
                        : wantRetry.set( b.clicker.user.id );

                    if ( wantRetry.size === 2 ) {

                        interactions.resetTimer();
                        restart.stop();
                        move = 0;

                        // —— Game board reset
                        board.map( ( r, ri ) => r.map( ( c, ci ) => board[ri][ci] = 0 ) );
                        gameEnd = false;

                        await game.edit(
                            this.language.startTurn( _currentPlayer ),
                            { embed: {
                                color       : _players.first === _currentPlayer ? "#DD2E44" : "#FDCB58",
                                description : this.renderBoard( board )
                            }
                        });

                        return;

                    }

                    button.setLabel( `${ this.language.newGame } ${ wantRetry.size }/2` );
                    await game.edit( { component: button } );
                    await b.defer();

                });

                restart.on( "end", async ( reason ) => reason === "time" && interactions.stop() );

            }

        }).on( "end", async () => { 

            await game.edit(
                this.language.end,
                { embed: {
                    description : this.renderBoard( board )
                }
            });

        });

   }

    renderBoard( board ) {

        return board.map( ( r ) => {
            return r.map( ( c ) => {
                switch ( c ) {
                    case 0  : return "⬛";
                    case -1 : return "🟥";
                    case 1  : return "🟨";
                }
            }).join( "" );
        }).join( "\n" );

    }

    getWinner( board, r, c, turn ) {

        // —— Rows
        let count = 0;
        for ( const piece of board[r] ) {
            piece === turn ? count++ : ( count = 0 );
            if ( count >= 4 ) return true;
        }

        // —— Columns
        count = 0;
        for ( const piece of board.map( ( r ) => r[c] ) ) {
            piece === turn ? count++ : ( count = 0 );
            if ( count >= 4 ) return true;
        }

        // —— Diagonal
        count = 0;
        let shift = r - c;
        for ( let i = Math.max(shift, 0); i < Math.min( 6, 7 + shift ); i++ ) {
            board[i][i - shift] == turn ? count++ : ( count = 0 );
            if ( count >= 4 ) return true;
        }

        // —— Anti-diagonal
        count = 0;
        shift = r + c;
        for ( let i = Math.max(shift - 7 + 1, 0); i < Math.min( 6, shift + 1); i++ ) {
            board[i][shift - i] == turn ? count++ : ( count = 0 );
            if ( count >= 4 ) return true;
        }

    }

}

module.exports = Power4;