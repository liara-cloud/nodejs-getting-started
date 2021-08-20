var express = require("express");
var app = express();
var path = require("path");
const LIARA_URL = process.env.LIARA_URL || "localhost";

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.listen(3005, () =>
  console.log(`app listening on port 3005 on ${LIARA_URL}`)
);
