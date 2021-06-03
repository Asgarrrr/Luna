module.exports = {

    ping        : "読み込み中",
    latency     : "レイテンシー",
    components  : "サービス",
    servers     : "サーバーの状態",
    events      : "イベント",
    state       : ( code ) => ({
        "none"      : "すべてのオペレーティング システム.",
        "minor"     : "システムが部分的に動作を停止しました.",
        "major"     : "主要なサービスを停止します。",
        "critical"  : "ひどい死に方だ"
    })[ code ]

};