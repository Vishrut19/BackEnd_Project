const sqlite3 = require("sqlite3").verbose();
const csv = require("csv-parser");
const fs = require("fs");

let db = new sqlite3.Database("./movies.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the movies database.");

  db.run(
    `CREATE TABLE IF NOT EXISTS movies (id INTEGER PRIMARY KEY AUTOINCREMENT, movie TEXT, genre TEXT, runtime TEXT, certificate TEXT, rating REAL, stars TEXT, description TEXT, votes TEXT, director TEXT)`,
    [],
    (err) => {
      if (err) {
        console.error(err.message);
        return;
      }

      console.log("Movies table created.");

      fs.createReadStream("./IMBD.csv")
        .pipe(csv())
        .on("data", (row) => {
          db.run(
            "INSERT INTO movies (movie, genre, runtime, certificate, rating, stars, description, votes, director) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
              row.movie,
              row.genre,
              row.runtime,
              row.certificate,
              row.rating,
              row.stars,
              row.description,
              row.votes,
              row.director,
            ]
          );
        })
        .on("end", () => {
          console.log("CSV file successfully processed.");
          // Close the database connection here
          db.close((err) => {
            if (err) {
              console.error(err.message);
            }
            console.log("Closed the database connection.");
          });
        });
    }
  );
});
