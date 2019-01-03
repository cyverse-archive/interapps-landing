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

export const appsQyuery = `
SELECT DISTINCT a.id, a.name, a.description
   FROM apps a
JOIN app_steps s ON a.id = s.app_id
JOIN tasks t ON s.task_id = t.id
JOIN job_types jt ON t.job_type_id = jt.id
   WHERE jt.name= 'Interactive'
    AND  a.id IN ($1:csv)
   ORDER BY a.name;
`;

export function viceAnalyses(username,status, dataCallback) {
  getDB().any(analysesQuery, [username, status]).then(dataCallback);
}

export function viceApps(appIds, dataCallback) {
    getDB().any(appsQyuery, [appIds]).then(dataCallback);
}
