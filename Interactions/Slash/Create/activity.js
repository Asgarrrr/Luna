module.exports = ( client ) => {

    client.api.applications( client.user.id ).commands.post({ data: {
        name        : "activity",
        description : "Starts an activity on the server",
        options     : [{
            name        : "channel",
            type        : 7,
            description : "Where to start the activity ",
            required    : true,
        }, {
            name        : "activity",
            type        : 3,
            description : "The activity",
            required    : true,
            choices     : [
                {
                    "name": "Betrayal.io",
                    "value": "773336526917861400"
                },
                {
                    "name": "Fishington.io",
                    "value": "814288819477020702"
                },
                {
                    "name": "Poker Night",
                    "value": "755827207812677713"
                },
                {
                    "name": "YouTube Together",
                    "value": "755600276941176913"
                }
            ]
        }]

    }});

};