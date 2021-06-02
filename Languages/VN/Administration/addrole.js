module.exports = {

    noTarget    : "Bạn phải chọn một thành viên",
    noRole      : "Bạn phải chọn một hoặc nhiều vai trò",
    added       : ( added ) => added.length > 1 ? `Vai trò ${ added.join( ", " ) } đã được thêm` : `Vai trò ${ added.join( ", " ) } đã được thêm`,
    nothing     : "Không có gì đã được thêm vào ..."

};