// —— The fastest and simplest library for SQLite3 in Node.js
const SQL = require("better-sqlite3");

// —— Creates or connect database
const db  = new SQL("./database.sqlite");

[
    `CREATE TABLE IF NOT EXISTS Members (
        "_ID"           TEXT PRIMARY KEY NOT NULL,
        "UserID"        TEXT,
        "Username"      TEXT,
        "GuildID"       TEXT,
        "Guildname"     TEXT,
        "Roles"         TEXT,
        "Ban"           TEXT,
        "Warn"          TEXT,
        "JoinDate"      DATETIME DEFAULT CURRENT_TIMESTAMP,
        "CreatesDate"   DATETIME,
        "Xp"            INTEGER DEFAULT 0,
        "Lvl"           INTEGER DEFAULT 1,
        "Bot"           INTEGER DEFAULT 0
    );`,

    `CREATE UNIQUE INDEX IF NOT EXISTS
        idx_members_id ON Members (_ID);`,

    `CREATE TABLE IF NOT EXISTS Messages (
        "_ID"           TEXT PRIMARY KEY,
        "Timestamp"     DATETIME DEFAULT CURRENT_TIMESTAMP,
        "UserID"        TEXT,
        "User"          TEXT,
        "ChannelID"     TEXT,
        "Channel"       TEXT,
        "GuildID"       TEXT,
        "Guild"         TEXT,
        "Content"       TEXT,
        "Attachments"   TEXT
    );`,

    `CREATE UNIQUE INDEX IF NOT EXISTS
        idx_messages_id ON Messages (_ID);`,

    `CREATE TABLE IF NOT EXISTS Event (
        "_ID"           INTEGER PRIMARY KEY,
        "Timestamp"     DATETIME DEFAULT CURRENT_TIMESTAMP,
        "Type"          TEXT,
        "DATA"          TEXT
    )`

].forEach((query) => {
  db.prepare(query).run();
});

db.pragma("synchronous  = 1"  );
db.pragma("journal_mode = wal");

module.exports = db;