module.exports = {

    noTarget    : "メンバーを選択する必要があります",
    noRole      : "1 つ以上の役割を選択する必要があります",
    added       : ( added ) => added.length > 1 ? `役割 ${ added.join( ", " ) } 追加されました` : `役割 ${ added.join( ", " ) } 追加されました`,
    nothing     : "何も追加されていません..."

};