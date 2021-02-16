const { token } = require("../config.json");

const fetch = require("node-fetch");

function OAuth2Check(req, res, next) {

    return req.session.user ? next() : res.redirect("/auth");

}

async function getBotGuilds() {
    const response = await fetch("https://discord.com/api/v8/users/@me/guilds", {
        method: "GET",
        headers: {
            Authorization: `Bot ${token}`,
        },
    });

    return response.json();
}

async function mutualGuilds(user, client) {

    return user.guilds.filter((x) => client.guilds.cache.get(x.id));

}

module.exports = {
    OAuth2Check,
    getBotGuilds,
    mutualGuilds,
};