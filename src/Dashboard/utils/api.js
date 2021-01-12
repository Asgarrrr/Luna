// ██████ Integrations █████████████████████████████████████████████████████████

// —— A light-weight module that brings window.fetch to Node.js.
const fetch     = require("node-fetch")

    , {token}   = require("../../config.json");

// █████████████████████████████████████████████████████████████████████████████


function OAuth2Check(req, res, next) {

    if (req.session.user) {
        return next();
    } else {
        req.session.state = Math.random().toString(36).substring(7);
        return res.redirect("/auth");
    }

}

async function getBotGuilds() {
    const response = await fetch("https://discord.com/api/v8/users/@me/guilds", {
        method: "GET",
        headers: {
            Authorization: `Bot ${token}`
        }
    })

    return response.json();
}

function getMutualGuild( userGuild, botGuild ) {

    return userGuild.filter()
}


module.exports = {
    OAuth2Check,
    getBotGuilds
}