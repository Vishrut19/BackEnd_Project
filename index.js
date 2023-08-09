const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const PORT = 4000;

let db = new sqlite3.Database("./movies.db", sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the movies database.");
});

app.get("/", (req, res) => {
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
});

app.get("/search", (req, res) => {
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
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
