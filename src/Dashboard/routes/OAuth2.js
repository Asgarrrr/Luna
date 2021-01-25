// ██████ Integrations █████████████████████████████████████████████████████████

// —— A light-weight module that brings window.fetch to Node.js.
const fetch         = require("node-fetch")
// —— Fast, unopinionated, minimalist web framework for Node.js.
    , express       = require("express")
// —— Dashboard configuration information.
    , { dashboard } = require("../../config.json");

// ██████ Routes ███████████████████████████████████████████████████████████████

// —— Get an instance of router
const router = new express.Router();

const baseURL = `${dashboard.url}/auth`;

router.get("/", async (req, res) => {

    if(!req.session.user || !req.session.user.id || !req.session.user.guildsData)
        return res.redirect(`https://discord.com/api/v8/oauth2/authorize?client_id=${req.client.user.id}&redirect_uri=${encodeURIComponent(baseURL + "/authorize")}&response_type=code&scope=identify%20guilds&state=${req.session.state}`);
    else
        return res.redirect("/authorize");

});

router.get("/authorize", async (req, res) => {

    if (!req.query.code || req.query.state !== req.session.state)
        return res.redirect("/");

    delete req.session.state;

    const parameters = new URLSearchParams();

    parameters.append("client_id", req.client.user.id);
    parameters.append("client_secret", req.client.config.CLIENT_SECRET);
    parameters.append("code", req.query.code);
    parameters.append("grant_type", "authorization_code");
    parameters.append("redirect_uri", `${baseURL}/authorize`);
    parameters.append("scope", "identify guilds");

    const userGrant = await fetch("https://discord.com/api/v8/oauth2/token", {
        method: "POST",
        body: parameters.toString(),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded" },
    }).then((response) => response.json());

    res.redirect(`${baseURL}/data?token=${userGrant.access_token}`);

});

router.get("/data", async (req, res) => {

    if (!req.query.token)
        return res.redirect("/");

    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${req.query.token}` },
    };

    // —— Retrieve user information
    const userData = await fetch("https://discord.com/api/users/@me", options)
        .then((response) => response.json());

    // —— Retrieve information from user's guilds and checks the user's administrative privileges
    const guildsData = (await fetch("https://discord.com/api/users/@me/guilds", options)
        .then((response) => response.json()))
        .filter((guild) => ((guild.permissions & 0x8) !== 0));

    req.session.user = { ...userData, ...{ guildsData } };

    return res.redirect("/");

});

module.exports = router;