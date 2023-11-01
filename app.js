const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const User = require("./userModel");
const nodemailer = require("nodemailer");
const multer = require('multer');
require('dotenv').config();

// اتصال به پایگاه داده
mongoose.connect("mongodb://root:wiTFSsLYSoi9Pqz0NsLXypN1@grace.iran.liara.ir:32063/my-app?authSource=admin");

// تعریف schema و model برای پست‌ها
const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: String // اضافه کردن فیلد تصویر
});

const Post = mongoose.model('Post', postSchema);

const app = express();

let isLoggedIn = false;

// تنظیمات مربوط به موتور مشاهده‌گر
app.set('view engine', 'ejs');

// استفاده از bodyParser و فایل‌های استاتیک
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// تنظیمات آپلود تصاویر با استفاده از Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// محتوای صفحات
const homeContent = "This is Liara Blog Which is Built For Learning And Doing Some Stuff";
const aboutContent = "This Blog Website is created with the help of Node.js and Database MongoDB. Other Technologies used are: Expressjs, EJS and Mongoose.";
const contactContent = "";

// روت اصلی
app.get("/", function (req, res) {
  Post.find({}, function (err, result) {
    if (!err) {
      res.render('home', { startingContent: homeContent, posts: result });
    }
  });
});

// روت‌های دیگر
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

// تنظیمات ارسال ایمیل
const MAIL_HOST = "smtp.c1.liara.email";
const MAIL_PORT = 587;
const MAIL_USER = "musing_black_uqa9od";
const MAIL_PASSWORD = "829162f2-0ef5-402e-9be2-19c7b978ef30";

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
    from: 'welcome@alinajmabadi.ir',
    to: email,
    subject: 'Test Email Subject',
    html: '<h1>Example HTML Message Body</h1>'
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

  // یافتن کاربر با نام کاربری در پایگاه داده
  User.findOne({ username: username }, function(err, foundUser) {
    if (err) {
      console.error(err);
      res.redirect("/error"); // در صورت خطا می‌توانید به یک صفحه خطا هدایت کنید
    } else {
      if (foundUser && foundUser.password === password) {
        // اگر کاربر پیدا شد و رمز عبور مطابقت داشت
        isLoggedIn = true;
        res.redirect("/compose");
      } else {
        // اگر کاربر پیدا نشد یا رمز عبور مطابقت نداشت
        res.redirect("/login");
      }
    }
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
