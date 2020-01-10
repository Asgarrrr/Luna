/* —––——————————————————————————————————————————————————————————————————————————

    This setup file is preferably used in the "npm run-script setup"
    script; and is to be used to modify the information in the. env
    file, which is used for the proper operation of the bot.

  ███████ Integrations █████████████████████████████████████████████████████████*/

const gradient  = require('gradient-string'),                                   // Beautiful color gradients in terminal output
      prompts   = require('prompts'        ),                                   // Lightweight, beautiful and user-friendly prompts
      dotenv    = require('dotenv'         ),                                   // Loads environment variables from .env file
      chalk     = require('chalk'          ),                                   // Terminal string styling done right
      fs        = require('fs'             ),                                   // File System

      pjson     = require('./package.json' );                                   // Imports information from the .json package

dotenv.config();																 // Imports environment variables

(async () => {

    const ASCIIHeader = [                                                       // Ascii header
        "    __                         __   ____        __   ",
        "   / /   __  ______  ____ _   / /  / __ )____  / /_  ",
        "  / /   / / / / __ \\/ __ `/  / /  / __  / __ \\/ __/",
        " / /___/ /_/ / / / / /_/ /  / /  / /_/ / /_/ / /_    ",
        "/_____/\\__,_/_/ /_/\\__,_/  / /  /_____/\\____/\\__/",
        "                          /_/"
    ].join('\n');

    console.clear();                                                            // Cleans the console
    console.log([
        chalk.bold(gradient("#8EA6DB", "#6A54C9")(ASCIIHeader)),                // Print the header
        chalk.hex("#6A54C9").bold.italic("A template for anyone to create a discord bot\n\n"),
        `– ${chalk.hex("#6A54C9").bold(Object.keys(pjson.dependencies).length)} packages have been installed\n`
    ].join('\n'))

    const questions = [{                                                        // Collecting information with prompt pakage
            type: 'text',
            name: 'token',
            message: 'Please enter the bot token from the application page\n',
            initial: process.env.TOKEN,
            validate: value => value.length <= 58 ? `The bot token is needed` : true
        }, {
            type: 'number',
            name: 'ownerID',
            message: 'Now, enter the bot owner\'s User ID',
            initial: process.env.MASTER
        }, {
            type: 'text',
            name: 'prefix',
            message: 'Prefix',
            validate: value => (/\s/.test(value)) ? `The prefix can't contain space` : true,
            initial: process.env.PREFIX || '$'
        }, {
            type: 'text',
            name: 'richpresence',
            message: 'And what I\'m doing ?'
        }, {
            type: 'select',
            name: 'richtype',
            message: 'Activity type',
            choices: [{
                title: 'Playing',
                value: 'PLAYING'
            }, {
                title: 'Streaming',
                value: 'STREAMING'
            }, {
                title: 'Listening',
                value: 'LISTENING'
            }, {
                title: 'Watching',
                value: 'WATCHING'
            }]
        }, {
            type: prev => prev == 'STREAMING' ? 'text' : null,
            name: 'richurl',
            message: 'Streaming URL'
        }
    ];

    const onCancel = () => {                                                    // Invoked when the user cancels/exits the prompt
        console.log('\nOh, you changed your mind ...');
        return false;
    };

    const response = await prompts(questions, { onCancel });

    var richurl = response.richurl ? response.richurl : "https://undefined.com"

    const env = [
        "# ███████ Information about the Discord application ████████████████████████████",
        "TOKEN = "  + response.token,
        "MASTER = " + response.ownerID,
        "PREFIX = " + response.prefix,
        "RICHPR = " + response.richpresence,
        "RICHTY = " + response.richtype,
        "RICURL = " + richurl
    ].join('\n')

    fs.writeFile('.env', env, (err) => {                                        // If it doesn't exist, create an '.env' file, and include collected information.

        if (err) throw err;

        console.log([
            "\n\n🔥 ALL IS DONE ^^ !\n",
            "The setup is complete, you can now, if not already done,",
            "invite the bot on your server. Commands are already present,",
            "but the goal is to make this bot yours.\n",
            chalk.italic("Improve his code, add what you need !\n"),
            chalk `Type {italic.grey node Luna.js} to start the bot`
        ].join('\n'));
    })
})();