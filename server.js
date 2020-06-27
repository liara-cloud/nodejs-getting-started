var express = require("express");
var morgan = require("morgan");
var app = express();
var path = require("path");
var mysql = require("mysql");
const MongoClient = require("mongodb").MongoClient;
const mongoDSN = process.env.MONGO_DSN;
const LIARA_URL = process.env.LIARA_URL || "localhost";

app.use(morgan("tiny"));
app.use(express.static("public"));

app.get("/", function (req, res) {
  console.log(`--> a user here!`);
  res.sendFile(path.join(__dirname + "/index.html"));
});

// // MySQL DB connection
// var connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
// });

// connection.connect();
// connection.query("SELECT 1 + 1 AS plus", function (error, results, fields) {
//   if (error) throw error;
//   console.log("The 1+1 is: ", results[0].plus);
// });
// connection.end();

// // MongoDB connection
// MongoClient.connect(mongoDSN, function (err, client) {
//   console.log("Connected successfully to server");
//   client.close();
// });

app.listen(8000, () =>
  console.log(`app listening on port 8000 on ${LIARA_URL}`)
);
