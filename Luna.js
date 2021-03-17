/*     __                      ____        __
      / /   __  ______  ____ _/ __ )____  / /_
     / /   / / / / __ \/ __ `/ __  / __ \/ __/
    / /___/ /_/ / / / / /_/ / /_/ / /_/ / /_
   /_____/\__,_/_/ /_/\__,_/_____/\____/\__/

   — An adorable Discord bot.           <3
   —— Free, Open Source and Cross Platform                                    */

// ██████ Integrations █████████████████████████████████████████████████████████

const Luna = require("./Structures/Luna");

// ██████ Initialization ███████████████████████████████████████████████████████

const client = new Luna();

client.start();

process.on("rejectionHandled"   , ( err ) => console.error( err ) );

process.on("unhandledRejection" , ( err ) => console.error( err ) );

process.on("uncaughtException"  , ( err ) => console.error( err ) );