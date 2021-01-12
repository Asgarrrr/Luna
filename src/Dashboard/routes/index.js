// ██████ Integrations █████████████████████████████████████████████████████████

// —— Fast, unopinionated, minimalist web framework for Node.js
const express = require('express');

const router = express.Router();

const { OAuth2Check, getBotGuilds } = require("../utils/api");

// █████████████████████████████████████████████████████████████████████████████

router.get("/", OAuth2Check, async (req, res) => {

	res.render('index', {
        title: 'Luna — Dashboard',
        client: req.client,
        user : req.user,
    });

});

router.get("/guild/:id", OAuth2Check, async (req, res) => {

        res.render('gdash', {
            title: 'Luna — Dashboard',
            client: req.client,
            user : req.user,
            guild: req.client.guilds.cache.get(req.params.id)
        });

})

module.exports = router;
