module.exports = {

    invalidLimit    : "Vui lòng cung cấp giá trị số cho giới hạn.",
    invalidRange    : "Giới hạn phải từ 1 đến 100.",
    noMessage       : "Có vẻ như đã xảy ra lỗi khi tìm nạp thư",
    invalidTarget   : "Mục tiêu không hợp lệ.",
    error           : ( size ) => `Không thể loại bỏ ${ size } tin nhắn.`,
    deleted         : ( size, target ) => `${ size } message ${ ( target && `từ ${ target === "đến" ? "bạn" : target }`) || ""} đã được xoá`,
    notDeleted      : "Bạn không thể xóa tin nhắn cũ hơn 14 ngày, ngoài ra, bạn có thể xóa tin nhắn từ người dùng, vai trò hoặc sử dụng các từ khóa` tôi`, `bot`,` tải lên` hoặc `ghim`"

};