module.exports = {

    details     : ( banned ) => `<@${banned.target.id}> has been banned for the following reason(s):\n\n> ${banned.reason ? banned.reason : "No reason provided" }\nThe sentence was handed down by <@${banned.executor.id}>`,
    missDetails : ( user   ) => `<@${user.id}> was banned, but I don't know why or by whom ...`,
    error       : `A ban happened, but it seems that an error occurred`

};