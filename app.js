const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const authrouter = require("./routes/auth.routes");
const bodyParser = require("body-parser");
const cors = require("cors");
const postsrouter = require("./routes/posts.routes");
const userrouter = require("./routes/user.routes");
const musicrouter = require("./routes/music.routes");

const app = express();
app.use(cors());

const PORT = config.get("PORT");

app.use(express.json({ extended: true }));
app.use("/api/auth", authrouter);
app.use("/api", postsrouter);
app.use("/api", userrouter);
app.use("/api", musicrouter);

app.use("/uploads", express.static("uploads"));

const start = async () => {
  try {
    await mongoose.connect(
      config.get("mongourl", {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
      })
    );
    app.listen(PORT, () => {
      console.log(`Server was started at port ${PORT}`);
    });
  } catch (e) {
    console.log("Connection error", e.message);
    process.exit;
  }
};

start();
