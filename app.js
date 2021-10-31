const express = require("express");
const config = require("config");

const PORT = config.get("port");

const app = express();
process.env.TZ = "Europe/Kiev";
app.use(express.json({ extended: "true" }));

app.use("/api/auth", require("./routes/auth.routes"));

app.use("/api/referenceBook/", require("./routes/ramps.routes"));

app.use("/api/referenceBook/", require("./routes/areas.routes"));

app.use("/api/referenceBook/", require("./routes/warehouses.routes"));

app.use("/api/referenceBook/", require("./routes/transportTypes.routes"));

app.use("/api/referenceBook/", require("./routes/suppliers.routes"));

app.use("/api/referenceBook/", require("./routes/receivers.routes"));

app.use("/api/referenceBook/", require("./routes/cargoTypes.routes"));

app.use("/api/referenceBook/", require("./routes/checkpoints.routes"));

app.use("/api/referenceBook/", require("./routes/extrabuildings.routes"));

app.use("/api/referenceBook/", require("./routes/incomingTypes.routes"));

app.use("/api/referenceBook/", require("./routes/parckings.routes"));

app.use("/api/referenceBook/", require("./routes/carriers.routes"));

app.use("/api/referenceBook/", require("./routes/warehouseSchedules.routes"));

app.use("/api/referenceBook/", require("./routes/rampSchedules.routes"));

app.use("/api/timeSlots/", require("./routes/timeSlots.routes"));

app.use("/api/workPlace/", require("./routes/unrelatedDocuments.routes"));

app.use("/api/workPlace/", require("./routes/relatedDocuments.routes"));

app.listen(PORT, () => console.log(`app startred on port ${PORT}`));
