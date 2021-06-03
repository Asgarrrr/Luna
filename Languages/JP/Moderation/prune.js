module.exports = {

    invalidLimit    : "制限の数値を入力してください。",
    invalidRange    : "制限は 1 から 100 である必要があります。",
    noMessage       : "メッセージの取得中にエラーが発生したようです",
    invalidTarget   : "無効なターゲットです。",
    error           : ( size ) => `操作不能 ${ size } メッセージ.`,
    deleted         : ( size, target ) => `${ size } メッセージ ${ ( target && `から ${ target === "来る" ? "友達" : target }`) || ""} 削除されました`,
    notDeleted      : "14 日以上経過したメッセージは削除できません。さらに、ユーザー、ロール、またはキーワード「me」、「bot」、「upload」、「pin」を使用してメッセージを削除できます。"

};