const { Pool } = require("pg")

module.exports = new Pool({
    user: 'postgres',
    password: '123qweasd',
    host: 'localhost',
    port: '5432',
    database: 'gymmanager'
})