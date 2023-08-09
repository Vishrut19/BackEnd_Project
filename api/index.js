const sqlite3 = require("sqlite3").verbose();

module.exports = async (req, res) => {
  let db = new sqlite3.Database("./movies.db", sqlite3.OPEN_READONLY);

  const page = req.query.page || 0;
  const limit = 10;
  const offset = page * limit;

  let query = `SELECT * FROM movies`;
  let queryParams = [];

  if (req.query.genre || req.query.certificate || req.query.rating) {
    const conditions = [];
    if (req.query.genre) {
      conditions.push(`genre LIKE ?`);
      queryParams.push(`%${req.query.genre}%`);
    }
    if (req.query.certificate) {
      conditions.push(`certificate = ?`);
      queryParams.push(req.query.certificate);
    }
    if (req.query.rating) {
      conditions.push(`rating = ?`);
      queryParams.push(req.query.rating);
    }

    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  query += ` LIMIT ? OFFSET ?`;
  queryParams.push(limit, offset);

  db.all(query, queryParams, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
};
