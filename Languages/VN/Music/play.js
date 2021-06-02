module.exports = {

    notInVoice  : "Bạn cần phải là một kênh thoại.",
    busy        : "Shark đã bận rộn với những thính giả khác, hãy tham gia cùng cô ấy!",
    cantJoin    : "Không thể tham gia kênh thoại.",
    notFound    : "Không tìm thấy phần tử này.",
    cantPlay    : "Không thể phát bản nhạc này",
    embedDesc   : ( message, length ) => `<@${ message.author.id }> đã thêm một mục vào danh sách phát ( \`${ length === "0:00" ? "Live" : length }\` )`,
    embedDescPl : ( message, size = 0, length = 0, lives = 0 ) => `<@${ message.author.id }> thêm ${ size } các mục trong danh sách phát ( \`${ length }\` ${ lives > 0 ? `& \`${ lives } lives\`` : "" } )`,
    incorrect   : "Url bạn đã nhập có vẻ không chính xác.",
    mix         : "Hỗn hợp không được hỗ trợ.",
    cantGetPlst : "Không thể tải danh sách phát này.",
    emptyPlst   : "Danh sách phát có vẻ trống.",
    error       : "Một lỗi đã xảy ra",
    now         : "Đang chơi ...",
};