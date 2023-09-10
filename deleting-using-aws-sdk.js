const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();

const client = new S3Client({
    region: "default",
	endpoint: process.env.LIARA_ENDPOINT,
	credentials: {
		accessKeyId: process.env.LIARA_ACCESS_KEY,
		secretAccessKey: process.env.LIARA_SECRET_KEY
	},
});

const params = {
  Bucket: process.env.LIARA_BUCKET_NAME,
  Key: "liara-poster.png"
};

// callback
client.send(new DeleteObjectCommand(params), (error, data) => {
  if (error) {
    console.log(error);
  } else {
    console.log("File deleted successfully");
  }
});