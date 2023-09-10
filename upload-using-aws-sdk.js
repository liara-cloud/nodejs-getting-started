const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();

const client = new S3Client({
    region: "default",
	endpoint: process.env.LIARA_ENDPOINT,
	credentials: {
		accessKeyId: process.env.LIARA_ACCESS_KEY,
		secretAccessKey: process.env.LIARA_SECRET_KEY
	},
});

const fs = require('fs');
const fileName = 'liara-poster.png';
const filePath = `./${fileName}`;
const fileContent = fs.readFileSync(filePath);

const params = {
	Body: fileContent,
	Bucket: process.env.LIARA_BUCKET_NAME,
	Key: fileName,
};

// callback
client.send(new PutObjectCommand(params), (error, data) => {
  if (error) {
    console.log(error);
  } else {
    console.log(data);
  }
});