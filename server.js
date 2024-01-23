const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); 
});

app.post('/upload', upload.single('myFile'), (req, res) => {
  const uploadedFile = req.file;
  const downloadLink = `${req.protocol}://${req.get('host')}/uploads/${uploadedFile.filename}`;

  res.send(`file uploaded successfully. <br> link: <a href="${downloadLink}">${uploadedFile.filename}</a>`);
});

app.use('/uploads', express.static('uploads'));

// شروع سرور
app.listen(port, () => {
  console.log(`server is running on localhost:${port}`);
});
