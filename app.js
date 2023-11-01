const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const User = require("./userModel");
const nodemailer = require("nodemailer");
const multer = require('multer');
require('dotenv').config();

// CONNECT TO DB
mongoose.connect(process.env.MONGOOSE_URI,);

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: String 
});

const Post = mongoose.model('Post', postSchema);
const app = express();
let isLoggedIn = false;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// PAGE CONTENT
const homeContent = "This is Liara Blog Which is Built For Learning And Doing Some Stuff";
const aboutContent = "This Blog Website is created with the help of Node.js and Database MongoDB. Other Technologies used are: Expressjs, EJS and Mongoose.";
const contactContent = "";

// MAIN ROOT 
app.get("/", function (req, res) {
  Post.find({}, function (err, result) {
    if (!err) {
      res.render('home', { startingContent: homeContent, posts: result });
    }
  });
});

// OTHER ROOTS
app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  if (isLoggedIn) {
    res.render("compose");
  } else {
    res.redirect("/login");
  }
});

app.get("/login", function (req, res) {
  res.render("login"); 
});

app.get("/signup", function (req, res) {
  res.render("signup");
});

app.get("/logout", function (req, res) {
  res.redirect('/');
  isLoggedIn = false;
});

app.use("public/uploads", express.static("uploads"));


app.post("/compose", upload.single('media'), function (req, res) {
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody,
    image: req.file ? '/uploads/' + req.file.filename : null // اضافه کردن فیلد تصویر
  };

  // ذخیره اطلاعات پست در پایگاه داده
  Post.insertMany(post, (err, result) => {
    if (!err) {
      console.log("Successfully Composed New Post");
    }
  });

  res.redirect("/");
});

app.get("/delete", function (req, res) {
  Post.find({}, function (err, result) {
    if (!err) {
      res.render('delete', { posts: result });
    }
  });
});

app.post('/delete', (req, res) => {
  const deletePostId = req.body.deleteButton;

  Post.deleteMany({ _id: deletePostId }, (err, result) => {
    if (!err) {
      console.log("Successfully Deleted Post " + deletePostId);
      console.log(result);
    } else {
      console.log(err);
    }
  });

  res.redirect("/delete");
});

app.get("/favicon.ico", (req, res) => { });

app.get("/posts/:postId", function (req, res) {
  const requestedId = req.params.postId;

  Post.findOne({ _id: requestedId }, (err, result) => {
    if (!err) {
      res.render("post", { title: result.title, content: result.content, imageUrl: result.image });
    } else {
      // Handle error
    }
  });
});

// SENDING EMAIL CONF
const MAIL_HOST     = process.env.MAIL_HOST;
const MAIL_PORT     = process.env.MAIL_PORT;
const MAIL_USER     = process.env.MAIL_USER;
const MAIL_PASSWORD = process.env.MAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT,
  tls: true,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASSWORD,
  }
});

app.post("/signup", function (req, res) {
  const { name, email, username, password, confirmPassword } = req.body;

  const newUser = new User({
    name,
    email,
    username,
    password
  });

  transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: email,
    subject: 'Welcome to Liara Blog',
    html: '<h1>So Happy To See You As A Member In Our Blog :)</h1>'
  })
  .then(() => console.log('OK, Email has been sent.'))
  .catch(console.error);

  newUser.save(function(err) {
    if (err) {
      console.log(err);
      res.redirect("/signup");
    } else {
      console.log("User saved successfully.");
      isLoggedIn = true;
      res.redirect("/compose");
    }
  });
});

app.post("/login", function (req, res) {
  const { username, password } = req.body;

  User.findOne({ username: username }, function(err, foundUser) {
    if (err) {
      console.error(err);
      res.redirect("/error"); 
    } else {
      if (foundUser && foundUser.password === password) {
        isLoggedIn = true;
        res.redirect("/compose");
      } else {
        res.redirect("/login");
      }
    }
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
