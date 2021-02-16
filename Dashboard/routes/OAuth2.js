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

// ——
router.get("/", async (req, res) => {

    req.session.state = Math.random().toString(36).substring(7);

    const APIUrl = new URL("https://discord.com/api/v8/oauth2/authorize");
    APIUrl.searchParams.append("client_id", req.client.user.id);
    APIUrl.searchParams.append("redirect_uri", `${dashboard.url}/auth/authorize`);
    APIUrl.searchParams.append("response_type", "code");
    APIUrl.searchParams.append("scope", "identify guilds guilds.join");
    APIUrl.searchParams.append("state", req.session.state);

    return !req.session.user || !req.session.user.id || !req.session.user.guildsData
        ? res.redirect(APIUrl)
        : res.redirect("/authorize");

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
    parameters.append("redirect_uri", `${dashboard.url}/auth/authorize`);
    parameters.append("scope", "identify guilds");

    const userGrant = await fetch("https://discord.com/api/v8/oauth2/token", {
        method: "POST",
        body: parameters.toString(),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded" },
    }).then((response) => response.json());

    res.redirect(`${dashboard.url}/auth/data?token=${userGrant.access_token}`);

});

router.get("/data", async (req, res) => {

    console.log("end");

    if (!req.query.token)
        return res.redirect("/");

    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${req.query.token}` },
    };

    // —— Get user and guilds information
    const [user, guilds] = await Promise.all([
        fetch("https://discord.com/api/users/@me", options),
        fetch("https://discord.com/api/users/@me/guilds", options),
    ]).then((responses) => Promise.all(responses.map((response) => response.json())));

    user.token = req.query.token;

    // —— Checks the user's administrative privileges
    req.session.user = { ...user, ...{ guilds: guilds.filter((guild) => ((guild.permissions & 0x8) !== 0)) } };

    return res.redirect("/");

});

module.exports = router;