const express = require("express");
const multer = require("multer");
const app = express();
const path = require("path");
const LIARA_URL = process.env.LIARA_URL || "localhost";
const { listFiles } = require('./util');

app.use(express.static("public"));
app.set('view engine', 'ejs');

const upload = multer({
  storage: multer.diskStorage({
    destination: (_, __, cb) => cb(null, './uploads'),
    filename: (_, file, cb) => cb(null, file.originalname),
  })
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/upload", async function (req, res) {
  const files = await listFiles('./uploads');
  res.render('upload', { files })
});

app.post('/upload', upload.single('file'), function (req, res) {
  res.redirect('/upload');
});

app.get('/download/:file', function (req, res) {
  res.download(`./uploads/${req.params.file}`);
});

app.listen(3005, () =>
  console.log(`app listening on port 3005 on ${LIARA_URL}`)
);
