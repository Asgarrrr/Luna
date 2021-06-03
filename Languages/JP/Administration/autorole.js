module.exports = {

    enabled         : "自動ロール割り当てが有効になっています!",
    notEnabled      : "ただし、自動ロール割り当ては無効で",
    currentRoles    : ( currentRoles ) => `役割 ${ currentRoles.map( ( x ) => `<@&${x}>` ).join( ", ") } 新人には自動的に割り当てられます.`,
    disabled        : "自動ロール割り当てが無効になっています。",
    cantAdd         : ( roles ) => `役割 ${ roles.join( ", " ) } 追加できません。彼らの特権は私の上にあり、私は彼らに与えることはできません `,
    noRole          : "追加/削除する 1 つ以上の役割を指定する必要があります",
    noChanges       : ( operation ) => ` 変更なし、自動割り当てが行われました ${ operation ? "enabled" : "disabled" } `,
    nothingToAdd    : "追加する役割がありません",
    error           : "これを実行できませんでした。エラーが発生しました...",
    missPerms       : "次の役割を追加できませんでした",
    assigned        : ( length ) => length ? "役割は次のように定義されています": "指定する役割はありません; (",

};