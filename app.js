const express = require("express");
const config = require("config");

const PORT = config.get("port");

const app = express();

app.use(express.json({ extended: "true" }));

app.use("/api/auth", require("./routes/auth.routes"));

app.use("/api/referenceBook/", require("./routes/ramps.routes"));

app.use("/api/referenceBook/", require("./routes/areas.routes"));

app.use("/api/referenceBook/", require("./routes/transportTypes.routes"));

app.listen(5000, () => console.log(`app startred on port ${PORT}`));
