const { S3Client } = require("@aws-sdk/client-s3");
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
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
  Key: "example.txt",
};

const command = new GetObjectCommand(params);

getSignedUrl(client, command, { expiresIn: 60 })
  .then(url => {
    console.log(`Download URL for ${params.Key}: ${url}`);
  })
  .catch(error => {
    console.error(error);
  });
