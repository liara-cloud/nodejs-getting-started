const { S3Client, ListObjectsV2Command } = require("@aws-sdk/client-s3");
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
  Bucket: process.env.LIARA_BUCKET_NAME
};

// callback
client.send(new ListObjectsV2Command(params), (error, data) => {
  if (error) {
    console.log(error);
  } else {
    const files = data.Contents.map((file) => file.Key);
    console.log(files);
  }
});