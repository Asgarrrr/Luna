module.exports = {

    notFound    : "ユーザーが見つかりません",
    noOperator  : "演算子を指定する必要があります。` + `、` -`、`*`、`/`、または `=` ",
    noQuantity  : "有効な金額を入力してください",
    noChange    : "変更は加えられていません",
    updated     : "レベルが更新されました",
    updatedData : ( updated, target ) => `のレベル ${ updated > 1 ? `${ updated } メンバー` : `<@${ target[0]._ID }>` } 更新されました`,
    error       : "エラーが発生しました",



};