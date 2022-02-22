const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/PitaambariWebsiteDB";
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const conn = mongoose.connection;
conn.once("open", () => {
  console.log("Connection Successful");
});
conn.on("error", (err) => {
  console.log(`Error: ${err}`);
});
