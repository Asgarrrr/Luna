
/*     __                      ____        __
      / /   __  ______  ____ _/ __ )____  / /_
     / /   / / / / __ \/ __ `/ __  / __ \/ __/
    / /___/ /_/ / / / / /_/ / /_/ / /_/ / /_
   /_____/\__,_/_/ /_/\__,_/_____/\____/\__/

   — An adorable Discord bot.           <3
   —— Free, Open Source and Cross Platform                                    */

// ██████ Integrations █████████████████████████████████████████████████████████

const Luna = require("./Base/Luna")

// ██████ Initialization ███████████████████████████████████████████████████████

const client = new Luna();

(async() => {

    client.loadCommands();

    client.loadEvents();

    client.login()

})()