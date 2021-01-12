
/* › Commands / ping.js ————————————————————————————————————————————————————————

   — Send test packets to the bot, and measures the response time, also,
     display information from the statuspage api about server & service
     states.

     ヽ( •_•)O´¯`°.¸.·´¯`Q(^o^ )`                                              */

// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command = require("../../Structures/Command"),
// —— A light-weight module that brings window.fetch to node.js
      fetch   = require("node-fetch");

// —— Discord status page API URL
const url = "https://srhpyqt94yxb.statuspage.io/api/v2/summary.json";

// —— List of components to check
const components = [
    [ "CloudFlare"  ], [ "Voice"                   ],
    [ "API"         ], [ "Tax Calculation Service" ],
    [ "Gateway"     ], [ "Push Notifications"       ],
    [ "Media Proxy" ], [ "Third-party"             ],
    [ "EU West"     ], [ "US West"                 ],
    [ "EU Central"  ], [ "Brazil"                  ],
    [ "Singapore"   ], [ "Hong Kong"               ],
    [ "Sydney"      ], [ "Russia"                  ],
    [ "US Central"  ], [ "Japan"                   ],
    [ "US East"     ], [ "South Africa"            ],
    [ "US South"    ],
];

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
            permission  : ["READ_MESSAGES", "SEND_MESSAGES"],
            allowDMs    : true
        });
    }

    async run(message) {

        const client = this.client;

        // —— Retrieve the language information for this command
        const lang = client.language.get(message.guild.local).ping(Date.now(), message);

        // —— Generates the embed containing the basic results
        const dataEmbed = {
            title : "P O N G !",
            color : 0x7354f6,
            fields : [{
                name  : "— ヽ( •_•)O´¯\\`°.¸.·´¯\\`Q(^o^ )\\`",
                value : [
                    "```",
                    lang[0],
                    lang[1],
                    "```"
                ].join("\n")
            }]
        };

        // —— Try to add the information provided by the status discord api
        try {

            var data = await (await fetch(url)).json();

            components.forEach((c, i) => {
                const res = data.components.find((x) => x.name === c[0]);

                components[parseInt(i, 10)][1] = res ? res.status === "operational" ? "✔" : "✗" : "?";
            })

            // —— Adds component information to the embed if available
            dataEmbed.fields.push({
                name  : lang[2],
                value : [
                    "```",
                    `CloudFlare │ ${[components[0][1]]} : ${[components[1][1]]} │ Voice`,
                    `       API │ ${[components[2][1]]} : ${[components[3][1]]} │ Tax Calc`,
                    `   Gateway │ ${[components[4][1]]} : ${[components[5][1]]} │ Push Notif`,
                    `Med. Proxy │ ${[components[6][1]]} : ${[components[7][1]]} │ Third-party`,
                    "```"
                ].join("\n")
            }, {
                name  : lang[3],
                value : [
                    "```",
                    `   EU West │ ${[components[ 8][1]]} : ${[components[ 9][1]]} │ US West`,
                    `EU Central │ ${[components[10][1]]} : ${[components[11][1]]} │ Brazil`,
                    ` Singapore │ ${[components[12][1]]} : ${[components[13][1]]} │ Hong Kong`,
                    `    Sydney │ ${[components[14][1]]} : ${[components[15][1]]} │ Russia`,
                    `US Central │ ${[components[16][1]]} : ${[components[17][1]]} │ Japan`,
                    `   US East │ ${[components[18][1]]} : ${[components[19][1]]} │ South Afr`,
                    `  US South │ ${[components[20][1]]} :   │ `,
                    "```"
                ].join("\n")
            }, {
                name  : lang[4],
                value : `\`\`\`${data.incidents ? "ok" : data.incidents}\`\`\``
            });

        } catch (error) {error;}

        // —— Send the embed
        message.channel.send({embed: dataEmbed});

    }
}

module.exports = Ping;