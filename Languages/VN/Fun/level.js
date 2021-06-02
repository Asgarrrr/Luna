module.exports = {

    notFound    : "Không tìm thấy người dùng",
    noOperator  : "Bạn phải cung cấp một nhà điều hành. `+`, `-`, `*`, `/` hoặc `=`",
    noQuantity  : "Bạn phải nhập một số tiền hợp lệ ",
    noChange    : "Không có thay đổi nào được thực hiện ",
    updated     : "Các cấp độ đã được cập nhật",
    updatedData : ( updated, target ) => `Các cấp độ của ${ updated > 1 ? `${ updated } các thành viên` : `<@${ target[0]._ID }>` } đã được cập nhật`,
    error       : "một lỗi đã xảy ra",

};