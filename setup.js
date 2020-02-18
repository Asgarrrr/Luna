(async () => {

    /*  console.log("–– Installation of prerequisites ...");
    switch (process.platform) {
        case "win32":
            exec('npm install --vs2015 -g windows-build-tools', { stdio: [0, 1, 2] });
            break;
        case "linux":
            console.log("–– Sorry, for the correct functioning on Linux, we need to install in administrator 'build-essential' (sudo apt-get install build-essential)");
            exec('sudo apt-get install build-essential', { stdio: [0, 1, 2] });
            break;
        case "darwin":
            console.log("–– Sorry, for the correct functioning on iOS, we need to install in administrator 'CommandLineTools (Xcode Cli)' (sudo rm -rf /Library/Developer/CommandLineTools & xcode-select --install). The installation window will open by itself, just follow the installation steps.");
            exec('sudo rm -réf /Library/Developer/CommandLineTools xcode-select --install', { stdio: [0, 1, 2]});
            break;
    } */

    console.log("–– Package installation ...");

    require("child_process").execSync("npm install --save", {
        stdio: [0, 1, 2]
    });

    console.clear();

    // Beautiful color gradients in terminal output
    const gradient = require("gradient-string"),
    // Terminal string styling done right
          chalk    = require("chalk"),
    // Lightweight, beautiful and user-friendly prompts
          prompts  = require("prompts"),
    // File System
          fs       = require("fs"),
    // Imports information from the .json package
          pjson    = require("./package.json");

    var settings;

    if (fs.existsSync("./settings.json")) {
        fs.readFile("settings.json", "utf-8", function read(err, data) {
            if (err) { throw err; }
            settings = JSON.parse(data);
        });
    } else {
        fs.writeFile("./settings.json", "{}", { flag: "wx" }, function (err) {
            if (err) { throw err; }
        });
    }

    var ASCIIHeader = [
        "    __                         __   ____        __   ",
        "   / /   __  ______  ____ _   / /  / __ )____  / /_  ",
        "  / /   / / / / __ \\/ __ `/  / /  / __  / __ \\/ __/",
        " / /___/ /_/ / / / / /_/ /  / /  / /_/ / /_/ / /_    ",
        "/_____/\\__,_/_/ /_/\\__,_/  / /  /_____/\\____/\\__/",
        "                          /_/"
    ].join("\n");

    console.log([
        // Print the header
        chalk.bold(gradient("#8EA6DB", "#6A54C9")(ASCIIHeader)),
        chalk.hex("#6A54C9").bold.italic("A template for anyone to create a discord bot\n\n"),
        `– ${chalk.hex("#6A54C9").bold(Object.keys(pjson.dependencies).length)} packages have been installed\n`
    ].join("\n"));

    // Collecting information with prompt package
    const questions = [
{
        type: "text",
        name: "token",
        message: "Please enter the bot token from the application page\n",
        initial: settings ? settings.Token : null,
        validate: (value) => (value.length <= 58 ? "The bot token is needed" : true)
    }, {
        type: "number",
        name: "ownerID",
        message: "Now, enter the bot owner's User ID",
        initial: settings ? settings.Master : null,
    }, {
        type: "text",
        name: "prefix",
        message: "Prefix",
        initial: settings ? settings.Prefix : "$",
        validate: (value) => (((/\s/).test(value)) ? "The prefix can't contain space" : true)
    }, {
        type: "text",
        name: "richpresence",
        message: "And what I'm doing ?",
        initial: settings ? settings.RPres : null,
    }, {
        type: "select",
        name: "richtype",
        message: "Activity type",
        choices: [
{
            title: "Playing",
            value: "PLAYING"
        }, {
            title: "Streaming",
            value: "STREAMING"
        }, {
            title: "Listening",
            value: "LISTENING"
        }, {
            title: "Watching",
            value: "WATCHING"
        }
]
    }, {
        type: (prev) => (prev === "STREAMING" ? "text" : null),
        name: "richurl",
        message: "Streaming URL (Twitch only)",
        initial: settings ? settings.RUrl : null,
    }
];

    const onCancel = () => {
        console.log("\n😢  Oh, no, you changed your mind... I'll see you soon?!  ");
        process.exit;
    };

    const response = await prompts(questions, {
        onCancel
    });

    const set = {
        Token: response.token,
        Master: response.ownerID,
        Prefix: response.prefix,
        RPres: response.richpresence,
        RType: response.richtype,
        RUrl: response.richurl
    };

    // If it doesn't exist, create an '.env' file, and include collected information.
    fs.writeFile("./settings.json", JSON.stringify(set, null, "\t"), (err) => {

        if (err) { throw err; }

        console.log([
            "\n\n🔥 ALL IS DONE ^^ !\n",
            "The setup is complete, you can now, if not already done,",
            "invite the bot on your server. Commands are already present,",
            "but the goal is to make this bot yours.\n",
            chalk.italic("Improve his code, add what you need !\n"),
            chalk`Type {italic.grey node Luna.js} to start the bot`
        ].join("\n"));
    });

})();