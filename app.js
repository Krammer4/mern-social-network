const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const authrouter = require("./routes/auth.routes");
const bodyParser = require("body-parser");
const cors = require("cors");
const postsrouter = require("./routes/posts.routes");
const userrouter = require("./routes/user.routes");
const musicrouter = require("./routes/music.routes");
const http = require("http");

const redis = require("redis");
const { error } = require("console");
// const redisAdapter = require("socket.io-redis");

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

const redisClient = redis.createClient({
  host: "127.0.0.1",
  port: 6379,
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-chat", async (roomName) => {
    socket.join(roomName);
    console.log("User joined chat:", roomName);

    await redisClient.lRange(
      `messages:${roomName}`,
      0,
      -1,
      (error, messages) => {
        if (!error) {
          socket.emit("load-messages", messages);
          console.log("Loaded messages:", messages);
        } else {
          console.log("ERROR while ranging messages: ", error);
        }
      }
    );
  });

  socket.on("send-message", async (roomName, message) => {
    await redisClient.lPush(`messages:${roomName}`, JSON.stringify(message));
    io.to(roomName).emit("new-message", message);
    console.log("New message:");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

redisClient.on("connect", () => {
  console.log("CONNECTED TO REDIS");
});

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
    redisClient.connect();
    server.listen(PORT, () => {
      console.log(`Server was started at port ${PORT}`);
    });
  } catch (e) {
    console.log("Connection error", e.message);
    process.exit;
  }
};

start();
