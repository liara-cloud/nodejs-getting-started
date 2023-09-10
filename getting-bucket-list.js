const { S3Client, ListBucketsCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();

const client = new S3Client({
	region: "default",
	endpoint: process.env.LIARA_ENDPOINT,
	credentials: {
		accessKeyId: process.env.LIARA_ACCESS_KEY,
		secretAccessKey: process.env.LIARA_SECRET_KEY,
	},
});


client.send(new ListBucketsCommand({}), (error, data) => {
  if (error) {
    console.log(error);
  } else {
    const buckets = data.Buckets.map((bucket) => bucket.Name);
    console.log(buckets); // List of bucket names
  }
});