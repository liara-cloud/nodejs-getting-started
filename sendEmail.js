// Importing the packages
const nodemailer = require('nodemailer');
require('dotenv').config();

// loading env variables
const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASSWORD } = process.env;

// setting smtp
const transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: MAIL_PORT,
    secure: false,
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD
    }
});

//  email info
const mailOptions = {
    from: 'example@example.com',   
    to: 'user@userdomain.com',
    subject: 'Hello',
    text: 'Hello from Node.js!'
};

// sending email 
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.error(error);
    }
    console.log('Message sent: %s', info.messageId);
});
