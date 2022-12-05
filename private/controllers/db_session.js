const  Pool  = require("pg");
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);

const pgPool = new Pool.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'session',
    password: '1234',
    port: 5432,
});

const ExpressSession = session({
    store: new pgSession({
        pool : pgPool,
        tableName : 'usr_session'   // Use another table-name than the default "session" one
        // Insert connect-pg-simple options here
    }),
    secret: 'session_cookie_secret',
    resave: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
    saveUninitialized: true
})

module.exports = ExpressSession;