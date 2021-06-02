module.exports = {

    ping        : "Đang tải dữ liệu",
    latency     : "Độ trễ",
    components  : "Dịch vụ",
    servers     : "Trạng thái máy chủ",
    events      : "Sự kiện",
    state       : ( code ) => ({
        "none"      : "Tất cả Hệ thống Hoạt động.",
        "minor"     : "Hệ thống ngừng hoạt động một phần.",
        "major"     : "Ngừng dịch vụ lớn.",
        "critical"  : "Đó là cái chết tiệt"
    })[ code ]

};