const express = require("express");
const app = express();
const PORT = 4000;

// Route requests to serverless functions
app.all("/search", require("./api/search"));
app.all("/", require("./api/index"));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
