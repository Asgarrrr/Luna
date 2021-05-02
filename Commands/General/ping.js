// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command = require( "../../Structures/Command" )
// —— A light-weight module that brings window.fetch to node.js
    , fetch   = require("node-fetch");

// —————— | ————————————————————————————————————————————————————————————————————
const pingPongTable = [ "(｡･ω･)ρ┳┷┳ﾟσ(･ω･*)" , "ヽ(^o^)ρ┳┻┳°σ(^o^)/" , " ( ^o)ρ┳┻┳°σ(o^ )" ];

// ██████ | ███████████████████████████████████████████████████████████ | ██████

// —— Create & export a class for the command that extends the base command
class Ping extends Command {

    constructor(client) {
        super(client, {
            name        : "ping",
            description : "Send test packets to the bot, and measures the response time, also, display information from the statuspage api about server & service states.",
            usage       : "ping",
            args        : false,
            category    : "General",
            cooldown    : 5000,
            aliases     : ["🏓", "pong"],
            permLevel   : 0,
            userPerms   : "SEND_MESSAGES",
            allowDMs    : true,
        });
    }

    async run(message) {

        const embed = { title : this.language.ping }
            , ping  = await super.respond( { embed } )
            , pong  = ( ping.createdTimestamp - message.createdTimestamp ) - this.client.ws.ping;

        embed.title = pingPongTable[ ~~( Math.random() * pingPongTable.length ) ];
        embed.url   = "https://srhpyqt94yxb.statuspage.io/";
        embed.color = "0x7354f6";
        embed.description = [
            "\`\`\`",
            `${ this.language.latency.padStart( 11, " " ) } │ ${ pong }ms`,
            `${ "Websocket".padStart( 11, " " ) } │ ${ this.client.ws.ping }ms`,
            "\`\`\`"
        ].join("\n");

        // —— Try to add the information provided by the status discord api
        try {

            const reqStatus = await fetch( "https://srhpyqt94yxb.statuspage.io/api/v2/summary.json", { timeout: 2000 })
                , status    = await reqStatus.json()
                , compoList = {};

            status.components.forEach( ( component ) => {
                compoList[component.name] = component.status === "operational" ? "✔" : "✗";
            });

            embed.fields = [];

            embed.fields[0] = {
                name : this.language.components,
                value: [ "```",
                    ` CloudFlare │ ${compoList["CloudFlare"]} : ${compoList["Third-party"]} │ Third-party`,
                    `        API │ ${compoList["API"]} : ${compoList["Tax Calculation Service"]} │ Tax Calc`,
                    `      Voice │ ${compoList["Voice"]} : ${compoList["Push Notifications"]} │ Push Notif`,
                    ` Med. Proxy │ ${compoList["Media Proxy"]} : ${compoList["Search"]} │ Search`,
                    "```"
                ].join("\n")
            };

            embed.fields[1] = {
                name : this.language.servers,
                value: [ "```",
                    `     Europe │ ${compoList["Europe"]} : ${compoList["Brazil"]} │ Brazil`,
                    `      India │ ${compoList["India"]} : ${compoList["South Africa"]} │ South Africa`,
                    `  Singapore │ ${compoList["Singapore"]} : ${compoList["Hong Kong"]} │ Hong Kong`,
                    `      Japan │ ${compoList["Japan"]} : ${compoList["South Korea"]} │ South Korea`,
                    `     Sydney │ ${compoList["Sydney"]} : ${compoList["US West"]} │ US West`,
                    `     Sydney │ ${compoList["Sydney"]} : ${compoList["US Central"]} │ US Central`,
                    `    US East │ ${compoList["US East"]} : ${compoList["US South"]} │ US South`,
                    "```"
                ].join("\n")
            };

            embed.fields[2] = {
                name : this.language.events,
                value: `\`\`\`${this.language.state(status.status.indicator)}\`\`\``
            };

            if ( status.incidents.length )
                embed.fields[2].value += `\`\`\`${ status.incidents.join("\n") }\`\`\``;

            if ( status.scheduled_maintenances.length )
                embed.fields[2].value += `\`\`\`${status.scheduled_maintenances.join("\n") }\`\`\``;

        } catch ( error ) {
            console.log( error );
        }

        // —— Send the embed
        ping.edit( { embed } );

    }
}

module.exports = Ping;