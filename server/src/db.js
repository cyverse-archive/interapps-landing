// Interactions with the DE DB.
//
// Requires the DB environment variable to be set to the connection string for
// the DE database. See ../.env.example for the format.

const initOptions = {};
const pgp = require('pg-promise')(initOptions);

let db;

export function getDB() {
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

const analysisQuery = `
SELECT *
  FROM vice_analyses
 WHERE username = $1
   AND id = $2
`;

export const timeLimitQuery = `
SELECT planned_end_date
  FROM vice_analyses
 WHERE username = $1
   AND ID = $2
`;

export const timeLimitUpdate = `
   UPDATE ONLY jobs
      SET planned_end_date = old_value.planned_end_date + interval '72 hours'
     FROM (SELECT planned_end_date FROM jobs WHERE id = $1) AS old_value
    WHERE jobs.id = $2
      AND jobs.user_id = $1
RETURNING jobs.planned_end_date
`;

const userIDQuery = 'SELECT id FROM users WHERE username = $1';

export const userID = (username, obj) => {
  if (!obj) {
    obj = getDB();
  }
  return obj.one(userIDQuery, [username]).then(data => data.id);
};

export const userAnalysis = (username, analysisID, obj) => {
  if (!obj) {
    obj = getDB();
  }
  return obj.one(analysisQuery, [username, analysisID]);
};

export function viceAnalyses(username, status) {
  return getDB().any(analysesQuery, [username, status]);
}

export function getTimeLimit(username, analysisID) {
  return getDB().any(timeLimitQuery, [username, analysisID]);
}

export const updateTimeLimit = (username, analysisID) =>
  getDB().task(t => // Wrap queries in a task to reuse the same connection.
    userAnalysis(username, analysisID, t) // used for validation
    .then(() => userID(username, t)) // also used for validation
    .then(userID => t.one(timeLimitUpdate, [userID, analysisID]))
      .then(data => data.planned_end_date));
