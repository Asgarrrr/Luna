module.exports = {

    details     : ( banned ) => `<@${banned.target.id}> đã bị cấm vì các lý do sau:\n\n> ${banned.reason ? banned.reason : "Không cung cấp lý do" }\nCâu nói được lưu truyền bởi <@${banned.executor.id}>`,
    missDetails : ( user   ) => `<@${user.id}> đã bị cấm, nhưng tôi không biết tại sao hoặc bởi ai ...`,
    error       : "Một lệnh cấm đã xảy ra, nhưng có vẻ như đã xảy ra lỗi"

};