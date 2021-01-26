// ██████ Integrations █████████████████████████████████████████████████████████

// —— Fast, unopinionated, minimalist web framework for Node.js
const express         = require("express")
// —— Include OAuth2 verification function
    , { OAuth2Check } = require("../utils/api");

// —— Get an instance of router
const router = new express.Router();

// █████████████████████████████████████████████████████████████████████████████

router.get("/", OAuth2Check, async (req, res) => {

	res.render("index", {
        title: "Luna — Dashboard",
        client: req.client,
        user : req.user,
    });

});

router.get("/guild/:id", OAuth2Check, async (req, res) => {

    res.render("gdash", {
        title: "Luna — Dashboard",
        client: req.client,
        user : req.user,
        guild: req.client.guilds.cache.get(req.params.id),
    });

});

module.exports = router;