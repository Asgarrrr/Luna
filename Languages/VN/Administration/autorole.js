module.exports = {

    enabled         : "Chỉ định vai trò tự động đã được bật!",
    notEnabled      : "Tuy nhiên, chỉ định vai trò tự động bị vô hiệu hóa",
    currentRoles    : ( currentRoles ) => `Roles ${ currentRoles.map( ( x ) => `<@&${x}>` ).join( ", ") } sẽ tự động được chỉ định cho những người mới đến.`,
    disabled        : "Chỉ định vai trò tự động đã bị tắt!",
    cantAdd         : ( roles ) => `Roles ${ roles.join( ", " ) } không thể được thêm vào. Đặc quyền của họ là trên của tôi, tôi không thể cho họ `,
    noRole          : "Bạn phải chỉ định một hoặc nhiều vai trò để thêm / bớt",
    noChanges       : ( operation ) => `Không có thay đổi, chỉ định tự động đã được ${ operation ? "enabled" : "disabled" } `,
    nothingToAdd    : "Không có vai trò nào để thêm",
    error           : "Không thể làm được điều này, đã xảy ra lỗi ...",
    missPerms       : "Không thể thêm các vai trò sau",
    assigned        : ( length ) => length ? "Các vai trò được xác định là": "Không có vai trò nào để chỉ định; (",

};