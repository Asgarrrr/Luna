module.exports = {

    notInVoice  : "音声チャンネルである必要があります。",
    busy        : "ルナは他のリスナーで忙しくしています。彼女に参加してください!",
    cantJoin    : "ボイスチャンネルに参加できません。",
    notFound    : "この要素は見つかりませんでした。",
    cantPlay    : "この曲は再生できません",
    embedDesc   : ( message, length ) => `<@${ message.author.id }> プレイリストにアイテムを追加しました ( \`${ length === "0:00" ? "Live" : length }\` )`,
    embedDescPl : ( message, size = 0, length = 0, lives = 0 ) => `<@${ message.author.id }> もっと ${ size } プレイリストのアイテム ( \`${ length }\` ${ lives > 0 ? `& \`${ lives } lives\`` : "" } )`,
    incorrect   : "入力した URL は正しくないようです。",
    mix         : "混合物はサポートされていません。",
    cantGetPlst : "このプレイリストを読み込めませんでした。",
    emptyPlst   : "プレイリストが空です。",
    error       : "エラーが発生しました",
    now         : "遊んでいる...",
};