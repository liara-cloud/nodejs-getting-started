// Import required packages
const nodemailer = require('nodemailer');
const dotenv = require('dotenv'); // in local, run `npm install dotenv` if needed

// Load environment variables from .env file
dotenv.config();

// Create reusable transporter object using the SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false, // true for 465, false for other ports (587 in this case for STARTTLS)
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    },

});

// Email options
const mailOptions = {
    from: `"my app" <${process.env.MAIL_FROM}>`, // Sender address
    to: 'test@example.com', // List of receivers
    subject: 'Test Email', // Subject line
    text: 'This is a test email sent from Node.js', // Plain text body
    html: '<b>This is a test email sent from Node.js</b>', // HTML body
    headers: {
      "x-liara-tag": "test_email", // Tags 
    },
};

// Send email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log('Error occurred: ' + error.message);
    }
    console.log('Email sent: ' + info.response);
});
