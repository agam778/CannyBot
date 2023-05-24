const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("CannyBot is alive!");
});

app.listen(port, () => {
  console.log(`The web server is running on port ${port}!`);
});

module.exports = app;
