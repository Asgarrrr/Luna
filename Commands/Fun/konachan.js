// ██████ Integrations █████████████████████████████████████████████████████████

// —— Import base command
const Command       = require("../../Structures/Command")

// —— Function for generating an embed with paging system
    , { pageEmbed } = require("../../Structures/Util");

// —— A light-weight module that brings window.fetch to Node.js
const fetch = require("node-fetch");

// ██████ | ███████████████████████████████████████████████████████████ | ██████

// —— Create & export a class for the command that extends the base command
class Konachan extends Command {

    constructor(client) {
        super(client, {
            name        : "konachan",
            description : "Returns an image, random or not, from konachan.com",
            usage       : "konachan {tags || nsfw || -l}",
            args        : false,
            category    : "Fun",
            cooldown    : 1000,
            permLevel   : 0,
            userPerms   : "SEND_MESSAGES",
            allowDMs    : true,
            nsfw        : true,
        });
    }

    async run(message, [ ...query ]) {

        // —— Define API URL
        const post = new URL("https://konachan.com/post.json");

        // —— Preserves pure spirit ...
        const rating = query.includes("nsfw")
            ? query.splice(query.indexOf("nsfw"), 1) && "rating:explicit"
            : "rating:safe";

        // —— Defined the number of items to retrieve
        post.searchParams.append("limit",
            query.includes("-l" || "-list")
                ? query.splice(query.indexOf("-l" || "-list"), 1) && 10 : 1
        );

        // —— Resolves all tag for find the better
        let tags = await Promise.all(query.map((tag) => fetch(`https://konachan.com/tag.json?name=${tag}&order=count&limit=1`)));
            tags = await Promise.all(tags.map((r) => r.json()));

        tags = [
            ...tags.flat(Infinity).map((tag) => tag.name),
            "order:random",
            rating
        ];

        // —— Append tags to the URL
        post.searchParams.append("tags", tags.join(" "));

        // —— Request
        let res = await fetch(post)
            .catch(() => { return super.respond("Failure at fetch"); });

        res = await res.json();

        if (!Object.keys(res).length)
            return super.respond("No result found");

        if (Object.keys(res).length > 1) {

            const pages = [];

            for (const result of res) {

                pages.push({
                    "image": {
                        "url": result.jpeg_url,
                    },
                });

            }

            pageEmbed(message, pages, true);

        } else {

            super.respond({embed: {
                "image": {
                    "url": res[0].jpeg_url,
                },
            }});

        }
    }
}

module.exports = Konachan;