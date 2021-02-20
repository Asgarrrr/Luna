// ██████ Integrations █████████████████████████████████████████████████████████

// —— Danbooru API wrapper
const _Danbooru = require("danbooru");

// —— Import base command
const Command = require("../../Structures/Command");

// —— One lined function to capitalize, remove _ and blanks.
const clean = (string) => (string.split(" ")).map((x) => x.replace(/_/g, " ").replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase())).filter(Boolean);

// ██████ | ███████████████████████████████████████████████████████████ | ██████

// —— Create & export a class for the command that extends the base command
class Danbooru extends Command {

    constructor(client) {
        super(client, {
            name        : "danbooru",
            description : "Returns an image, random or not, from Danbooru",
            usage       : "danbooru {makise_kurisu}",
            args        : false,
            category    : "Fun",
            cooldown    : 1000,
            permLevel   : 0,
            userPerms   : "SEND_MESSAGES",
            allowDMs    : true,
            nsfw        : true,
        });
    }

    async run(message, [ ...tags ]) {

        // —— Perform a search for popular image posts
        const booru = new _Danbooru();

        // —— Preserves pure spirit ...
        const rating = tags.includes("nsfw")
            ? tags.splice(tags.indexOf("nsfw"), 1) && "rating:explicit"
            : "rating:safe";

        // —— Query with selected tags
        const post = await booru.posts({
            random  : true,
            tags    : `${tags.join("_")} ${rating}`,
        });

        // —— Select a random post from posts array
        const winner = post[Math.floor(Math.random() * post.length)];

        if (!winner)
            return super.respond("No result found ;(");

        // —— Only useful elements are collected
        const {
            tag_string_character : character,
            tag_string_copyright : license,
            tag_string_artist    : artist,
            large_file_url       : img,
        } = winner;

        // —— Clean the different elements
        const characterCleaned  = clean(character)
            , licenseCleaned    = clean(license)
            , artistCleaned     = clean(artist);

        const reponse = { embed: {
            "fields": [],
            "image": {
                "url": img,
            },
        } };

        // —— Add characters list if they exist
        if (characterCleaned.length)
            reponse.embed.fields[0] = {
                name: characterCleaned.length > 1 ? "Characters" : "Character",
                value : characterCleaned.map((x, i) => `[${x}](https://danbooru.donmai.us/posts?tags=${character.split(" ")[i]})`),
            };

        // —— Add license list if they exist
        if (licenseCleaned.length)
            reponse.embed.fields[1] = {
                name: "From",
                value : licenseCleaned.map((x, i) => `[${x}](https://danbooru.donmai.us/posts?tags=${license.split(" ")[i]})`),
                inline: true,
            };

        // —— Add artist list if they exist
        if (artistCleaned.length)
            reponse.embed.fields[2] = {
                name: artistCleaned.length > 1 ? "Artists" : "Artist",
                value : artistCleaned.map((x, i) => `[${x}](https://danbooru.donmai.us/posts?tags=${artist.split(" ")[i]})`),
                inline: true,
            };

        super.respond(reponse);

    }
}

module.exports = Danbooru;