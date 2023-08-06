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
const redisAdapter = require("socket.io-redis");

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
  host: "localhost",
  port: 6379,
});

io.on("connection", async (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-chat", async (roomName) => {
    socket.join(roomName);
    console.log("SOCKET JOINED: ", roomName);
    await redisClient.lRange(
      `messages:${roomName}`,
      0,
      -1,
      (error, messages) => {
        if (!error) {
          socket.emit("load-messages", messages.reverse());
          console.log("Success while ranging messages");
        } else {
          cosnole.log("Error while ranging messages");
        }
      }
    );
    console.log("ROOM NAME: ", roomName);
  });

  socket.on("send-message", async (roomName, message) => {
    try {
      await redisClient.lPush(roomName, message, (err) => {
        if (err) {
          console.log("Error while saving message to Redis: ", err);
        } else {
          console.log("MESSAGE WAS PUSHED TO REDIS");
        }
      });

      io.to(roomName).emit("new-message", message);
      console.log("СООБЩЕНИЕ", message);
    } catch (error) {
      console.log("Error while saving messages to Redis: ", error.message);
    }
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
    await redisClient.connect();
    server.listen(PORT, () => {
      console.log(`Server was started at port ${PORT}`);
    });
  } catch (e) {
    console.log("Connection error", e.message);
    process.exit;
  }
};

start();
