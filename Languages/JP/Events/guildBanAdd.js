module.exports = {

    details     : ( banned ) => `<@${banned.target.id}> 以下の理由により禁止されています。\n\n> ${banned.reason ? banned.reason : "理由は示されていない" }\n代々受け継がれてきた格言 <@${banned.executor.id}>`,
    missDetails : ( user   ) => `<@${user.id}> 禁止されたが、なぜ、誰によって...`,
    error       : "禁止が発生しましたが、何か問題が発生したようです"

};