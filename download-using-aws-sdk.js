const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const client = new S3Client({
  region: "default",
  endpoint: process.env.LIARA_ENDPOINT,
  credentials: {
    accessKeyId: process.env.LIARA_ACCESS_KEY,
    secretAccessKey: process.env.LIARA_SECRET_KEY,
  },
});
const params = {
  Bucket: process.env.LIARA_BUCKET_NAME,
  Key: "liara-poster.png",
};

const downloadsPath = path.join(__dirname, "downloads");
const filePath = path.join(downloadsPath, params.Key);

// ایجاد پوشه downloads اگر وجود نداشته باشد
if (!fs.existsSync(downloadsPath)) {
  fs.mkdirSync(downloadsPath);
}

client
  .send(new GetObjectCommand(params))
  .then(async (data) => {
    fs.writeFileSync(filePath, await data.Body.transformToByteArray());

    console.log("File downloaded successfully!");
  })
  .catch((error) => {
    console.error("Error:", error);
  });