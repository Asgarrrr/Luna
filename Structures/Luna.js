// ██████ Integrations █████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API.
const { Client, Collection, Intents } = require( "discord.js" )
// —— A MongoDB object modeling tool designed to work in an asynchronous environment.
    , mongoose               = require( "mongoose" )
// —— Provides utilities for working with file and directory paths.
    , path                   = require( "path" )
// —— Glob implementation in JavaScript.
    , glob                   = require( "glob" )
// —— Beautiful color gradients in terminal output
    , gradient               = require( "gradient-string" )
// —— Terminal string styling done right
    , chalk                  = require( "chalk" );

// —— Includes structures
const Command       = require( "./Command.js" )
    , Event         = require( "./Event.js" )
    , Interaction   = require( "./Interaction" )
    , Guild         = require( "./Guild" );

// ██████ | ███████████████████████████████████████████████████████████████████

class Luna extends Client {

    constructor( options = {} ) {

        // —— Initialise discord.js client
        super( {
            ...options,
            intents: [
                Intents.ALL,
            ],
            ws: { intents: Intents.ALL }
        });

        // —— Import of the parameters required for operation
        this.config    = require( "../config.js" );
        // —— Collection of all commands
        this.commands  = new Collection();
        // —— Collection of all slash commands
        this.slash     = new Collection();
        // —— Collection of all command aliases
        this.aliases   = new Collection();
        // —— Loads the language dictionary
        this.language  = new Collection();
        // —— Import custom function ( avoid duplicated block )
        this.utils     = new ( require( "../Structures/Utils" ) )( this );

        this.disbut = require('discord-buttons')( this );

        // —— Cleaning the console 💨
        console.clear();

        // —— Just an ascii header, because I like it.
        console.log(
            chalk.bold(
                gradient("#8EA6DB", "#7354F6")([
                    "    __                      ____        __     ",
                    "   / /   __  ______  ____ _/ __ )____  / /_    ",
                    "  / /   / / / / __ \\/ __ `/ __  / __ \\/ __/  ",
                    " / /___/ /_/ / / / / /_/ / /_/ / /_/ / /_      ",
                    "/_____/\\__,_/_/ /_/\\__,_/_____/\\____/\\__/  ",
                    "\n",
                ].join("\n")),
            )
            + `Client initialised —— Node ${process.version}.\n`
        );


    }

    get directory() {
        return `${path.dirname(require.main.filename)}${path.sep}`;
    }

    async loadDatabase() {

        try {

            await mongoose.connect(this.config.mongodb, {
                useNewUrlParser     : true,
                useUnifiedTopology  : true,
                useFindAndModify    : false,
                useCreateIndex      : true
            });


            glob.sync( `${this.directory}/Models/*.js` ).forEach( ( file ) => {
                require( path.resolve( file ) );
            });

            this.db = mongoose.connection.models;

        } catch (error) {
            throw new Error(error);
        }

    }

    loadLanguages() {

        for ( const language of glob.sync( `${this.directory}/Languages/**/*.js` ) ) {

            const match = language.match(/.*\/([A-Z]{2})\//);

            if ( !match[1] )
                return;

            const ISO = match[1];

            if (!this.language[ISO])
                this.language[ISO] = {};

            delete require.cache[ language ];
            const file = require( path.resolve( language ) )
                , name = language.slice( language.lastIndexOf("/") + 1, language.lastIndexOf(".") );

            this.language[ISO][name] = file;

        }

    }

    /* ██████ Handler █████████████████████████████████████████████████████████

    A handler can divide the different commands and events, in separate
    batch file in subdirectories, providing more clarity. This also allows
    better configuration, to define aliases, a cooldown, and to manage
    bugs more easily.                                                     */

    // –– Events Handler ––––––––––––––––––––––––––––––––––––––––——–––––––––––––

    loadEvents() {

        for (const event of glob.sync( `${this.directory}/Events/**/*.js` )) {

            delete require.cache[ event ];
            const file = new ( require( path.resolve( event ) ) )( this );

            if ( !( file instanceof Event ) )
                return;

            super[ file.listener ]( file.name, ( ...args )  => file.run( ...args ) );

        }

    }

    loadInteractions() {

        for (const interactions of glob.sync( `${this.directory}/Interactions/*.js` )) {

            delete require.cache[ interactions ];
            const file = new ( require( path.resolve( interactions ) ) )( this );

            if ( !( file instanceof Interaction ) )
                return;

            this.ws[ file.listener ]( file.name, ( ...args )  => file.run( ...args ) );

        }

    }

    // –– Commands Handler ––––––––––––––––––––––––––––––––––––––––––––––––––––

    loadCommands() {

        for (const command of glob.sync(`${this.directory}/Commands/**/*.js`)) {

            delete require.cache[ command ];
            const file = new ( require( path.resolve( command ) ) )( this );

            if ( !( file instanceof Command ) )
                return;

            this.commands.set( file.name, file );

            if ( file.aliases && Array.isArray( file.aliases ) )
                file.aliases.forEach( ( alias ) => this.aliases.set( alias, file.name ) );

        }

    }

    login() {

        if ( !this.config.Token )
            throw new Error( "You must pass the token for the client..." );

        // —— Logs the client in, establishing a websocket connection to Discord.
        super.login( this.config.Token );

    }

    async start() {

        await this.loadDatabase();
        this.loadLanguages();
        this.loadInteractions();
        this.loadCommands();
        this.loadEvents();
        this.login();

    }

}

module.exports = Luna;