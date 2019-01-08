// Interactions with the DE DB.
//
// Requires the DB environment variable to be set to the connection string for
// the DE database. See ../.env.example for the format.

const initOptions = {};
const pgp = require('pg-promise')(initOptions);

let db;

function getDB() {
    if (db === undefined || db === null) {
        const cn = process.env.DB;
        db = pgp(cn);
    }
    return db;
}

export const analysesQuery = `
SELECT *
  FROM vice_analyses
 WHERE username = $1
  AND
 STATUS = $2      
`;

export function viceAnalyses(username,status, dataCallback) {
  getDB().any(analysesQuery, [username, status]).then(dataCallback);
}


