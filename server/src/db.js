const initOptions = {};
const pgp = require('pg-promise')(initOptions);
const cn = process.env.DB;
const db = pgp(cn);

export default db;
