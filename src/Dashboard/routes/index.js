// ██████ Integrations █████████████████████████████████████████████████████████

// —— Fast, unopinionated, minimalist web framework for Node.js
const express = require("express")
// —— Include OAuth2 verification and mutualGuilds function
    , { OAuth2Check, mutualGuilds } = require("../utils");

// —— Get an instance of router
const router = new express.Router();

// █████████████████████████████████████████████████████████████████████████████

router.get("/", OAuth2Check, async (req, res) => {

    res.render("index", {
        admin  : req.user,
        guilds : await mutualGuilds(req.user, req.client),
    });

});

module.exports = router;