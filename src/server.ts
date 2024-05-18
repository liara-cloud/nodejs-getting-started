import express from "express";
import path from "path";

const app = express();
const LIARA_URL = process.env.LIARA_URL || "localhost";
const PORT = 3005;

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT} on ${LIARA_URL}`);
});
