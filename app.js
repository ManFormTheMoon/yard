const express = require("express");
const config = require("config");

const PORT = config.get("port");

const app = express();

app.use(express.json({ extended: "true" }));

app.use("/api/auth", require("./routes/auth.routes"));

app.use("/api/referenceBook/", require("./routes/ramps.routes"));

app.get("/aba", (req, res) => {
  res.json({ message: "ok" });
});

app.listen(5000, () => console.log(`app startred on port ${PORT}`));
