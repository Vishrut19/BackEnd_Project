const sqlite3 = require("sqlite3").verbose();

module.exports = async (req, res) => {
  let db = new sqlite3.Database("./movies.db", sqlite3.OPEN_READONLY);

  const searchTerm = `%${req.query.q}%`;
  const page = req.query.page || 0;
  const limit = 10;
  const offset = page * limit;

  const queryParts = [
    `movie LIKE ?`,
    `genre LIKE ?`,
    `stars LIKE ?`,
    `director LIKE ?`,
    `description LIKE ?`,
  ];
  const queryParams = Array(5).fill(searchTerm);

  if (req.query.genre || req.query.certificate || req.query.rating) {
    if (req.query.genre) {
      queryParts.push(`genre LIKE ?`);
      queryParams.push(`%${req.query.genre}%`);
    }
    if (req.query.certificate) {
      queryParts.push(`certificate = ?`);
      queryParams.push(req.query.certificate);
    }
    if (req.query.rating) {
      queryParts.push(`rating = ?`);
      queryParams.push(req.query.rating);
    }
  }

  const query = `SELECT * FROM movies WHERE ${queryParts.join(
    " OR "
  )} LIMIT ? OFFSET ?`;
  queryParams.push(limit, offset);

  db.all(query, queryParams, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
};
